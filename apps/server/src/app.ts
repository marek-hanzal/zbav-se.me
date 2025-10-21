import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { AppEnv } from "./AppEnv";
import { auth } from "./auth";
import { withCategoryApi } from "./category/withCategoryApi";
import { withCategoryGroupApi } from "./category-group/withCategoryGroupApi";
import { database } from "./database/kysely";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withHealthApi } from "./health/withHealthApi";
import type { Routes } from "./hono/Routes";
import { withHono } from "./hono/withHono";
import { withSessionHono } from "./hono/withSessionHono";
import { withTokenHono } from "./hono/withTokenHono";
import { PayloadSchema } from "./jwt/PayloadSchema";
import { verify } from "./jwt/verify";
import { withListingApi } from "./listing/withListingApi";
import { withLocationApi } from "./location/withLocationApi";
import { withMigrationApi } from "./migration/withMigrationApi";
import { withOpenApi } from "./open-api/withOpenApi";

console.log("env", process.env);

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
const app = withOpenApi(withHono());

//
app.use(requestId());
app.use(secureHeaders());
app.use(
	cors({
		origin: AppEnv.ORIGIN,
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
		issuer: AppEnv.VITE_API,
		secret: AppEnv.JWT_SECRET,
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
withCategoryGroupApi(routes);
withListingApi(routes);
withGalleryApi(routes);
withLocationApi(routes);
withHealthApi(routes);
withMigrationApi(routes);

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
		origin: AppEnv.ORIGIN,
	}),
);
//

export default app;
