import { RedisStore } from "@hono-rate-limiter/redis";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";
import { AppEnv } from "./AppEnv";
import { auth } from "./auth";
import { withCategoryApi } from "./category/withCategoryApi";
import { database } from "./database/kysely";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withHealthApi } from "./health/withHealthApi";
import type { Routes } from "./hono/Routes";
import { withHono } from "./hono/withHono";
import { withSessionHono } from "./hono/withSessionHono";
import { withTokenHono } from "./hono/withTokenHono";
import { withJanitorApi } from "./janitor/withJanitorApi";
import { PayloadSchema } from "./jwt/PayloadSchema";
import { verify } from "./jwt/verify";
import { withListingApi } from "./listing/withListingApi";
import { withLocationApi } from "./location/withLocationApi";
import { withMigrationApi } from "./migration/withMigrationApi";
import { withOpenApi } from "./open-api/withOpenApi";
import { redis } from "./redis/redis";
import { withS3Api } from "./s3/withS3Api";
import { withUploadApi } from "./upload/withUploadApi";

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
const app = withOpenApi(withHono());

//
app.use(requestId());
app.use(secureHeaders());
app.use(
	cors({
		origin: [
			AppEnv.VITE_WEB_ORIGIN,
			AppEnv.VITE_APP_ORIGIN,
		],
		allowHeaders: [
			"Content-Type",
			"Authorization",
		],
		allowMethods: [
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"PATCH",
			"OPTIONS",
		],
		exposeHeaders: [
			"Content-Length",
			"X-Request-Id",
		],
		maxAge: 600,
		credentials: true,
	}),
);
app.use(
	bodyLimit({
		// We don't need to accept large large body as file uploads will be done directly to the Storage
		maxSize: 1024 * 50,
	}),
);
app.use(async (c, next) => {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		if (!session) {
			c.set("user", null);
			c.set("session", null);
			return next();
		}
		c.set("user", session.user);
		c.set("session", session.session);
		return next();
	} catch {
		c.set("user", null);
		c.set("session", null);
		return next();
	}
});

app.use("/api/session/*", async (c, next) => {
	const session = c.get("session");
	const user = c.get("user");
	if (!session || !user) {
		return c.json(
			{
				error: "Shooooo! Shooo!",
			},
			401,
		);
	}
	return next();
});
app.use("/api/token/*", async (c, next) => {
	const [, token] = c.req.header("Authorization")?.split(" ") ?? [];

	if (!token) {
		return c.json(
			{
				error: "Shooooo! Shooo!",
			},
			401,
		);
	}

	const { payload } = await verify(token, {
		issuer: AppEnv.VITE_SERVER_API,
		secret: AppEnv.SERVER_JWT_SECRET,
		scope: c.req.path,
		schema: PayloadSchema,
	});

	c.set(
		"user",
		await database.kysely
			.selectFrom("user")
			.where("id", "=", payload.userId)
			.selectAll()
			.executeTakeFirstOrThrow(),
	);

	return next();
});

//

const withUserRateLimiter = rateLimiter<{
	Variables: {
		user: typeof auth.$Infer.Session.user;
	};
}>({
	store: new RedisStore({
		client: redis,
	}),
	windowMs: 15 * 60 * 1000,
	limit: 6,
	keyGenerator(c) {
		return `user:${c.get("user").id}`;
	},
	message: "Rate limit exceeded. Please try again later.",
});

app.use("/api/session/*", withUserRateLimiter);
app.use("/api/token/*", withUserRateLimiter);

//

app.on(
	[
		"POST",
		"GET",
	],
	"/api/auth/*",
	(c) => auth.handler(c.req.raw),
);
//
const routes: Routes = {
	session: withSessionHono(),
	token: withTokenHono(),
	public: withHono(),
};

withCategoryApi(routes);
withListingApi(routes);
withGalleryApi(routes);
withUploadApi(routes);
withLocationApi(routes);
withHealthApi(routes);
withMigrationApi(routes);
withS3Api(routes);
withJanitorApi(routes);

app.options("/api/cors-proxy", (c) => {
	c.header("Access-Control-Allow-Origin", "*");
	c.header("Access-Control-Allow-Methods", "GET, OPTIONS");
	c.header("Access-Control-Allow-Headers", "Content-Type");
	return c.body(null, 204);
});

app.get("/api/cors-proxy", async (c) => {
	const urlParam = c.req.query("url");
	if (!urlParam) {
		return c.text("Missing ?url=", 400);
	}

	let target: URL;
	try {
		target = new URL(urlParam);
	} catch {
		return c.text("Invalid URL", 400);
	}

	const upstream = await fetch(target.toString(), {
		method: "GET",
		redirect: "follow",
	});

	if (!upstream.ok) {
		return c.text(`Upstream ${upstream.status}`, 502);
	}

	const headers = new Headers();
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
	headers.set(
		"Access-Control-Expose-Headers",
		"Content-Type, Content-Length, ETag, Cache-Control",
	);
	headers.set("Cache-Control", "public, max-age=60");

	const contentType = upstream.headers.get("content-type");
	if (contentType) {
		headers.set("Content-Type", contentType);
	}
	const contentLength = upstream.headers.get("content-length");
	if (contentLength) {
		headers.set("Content-Length", contentLength);
	}

	return new Response(upstream.body, {
		status: 200,
		headers,
	});
});

//

const sessionRoutes = withSessionHono();
sessionRoutes.route("/session", routes.session);

const tokenRoutes = withTokenHono();
tokenRoutes.route("/token", routes.token);

const publicRoutes = withHono();
publicRoutes.route("/public", routes.public);

app.route("/api", sessionRoutes);
app.route("/api", tokenRoutes);
app.route("/api", publicRoutes);
//
app.get("/origin", (c) =>
	c.json({
		origin: [
			AppEnv.VITE_WEB_ORIGIN,
			AppEnv.VITE_APP_ORIGIN,
		],
	}),
);
//

export default app;
