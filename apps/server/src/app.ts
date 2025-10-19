import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { withCategoryApi } from "./category/withCategoryApi";
import { withCategoryGroupApi } from "./category-group/withCategoryGroupApi";
import { withContentApi } from "./content/withContentApi";
import { AppEnv } from "./env";
import { withHealthApi } from "./health/withHealthApi";
import { withListingApi } from "./listing/withListingApi";
import { withLocationApi } from "./location/withLocationApi";
import { withMigrationApi } from "./migration/withMigrationApi";
import { withOpenApi } from "./open-api/withOpenApi";

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
const app = withOpenApi(
	new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user | null;
			session: typeof auth.$Infer.Session.session | null;
		};
	}>(),
);

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
});

app.use("/api/protected/*", async (c, next) => {
	const session = c.get("session");
	if (!session) {
		return c.json(
			{
				error: "Shooooo! Shooo!",
			},
			401,
		);
	}
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
const protectedEndpoints = new OpenAPIHono();
protectedEndpoints.route("/", withContentApi);
protectedEndpoints.route("/", withCategoryGroupApi);
protectedEndpoints.route("/", withCategoryApi);
protectedEndpoints.route("/", withListingApi);
protectedEndpoints.route("/", withLocationApi);
protectedEndpoints.route("/", withMigrationApi);

const publicEndpoints = new OpenAPIHono();
publicEndpoints.route("/", withHealthApi);

//

const protectedRoutes = new OpenAPIHono();
protectedRoutes.route("/protected", protectedEndpoints);

const publicRoutes = new OpenAPIHono();
publicRoutes.route("/public", publicEndpoints);

app.route("/api", protectedRoutes);
app.route("/api", publicRoutes);
//
app.get("/origin", (c) =>
	c.json({
		origin: AppEnv.ORIGIN,
	}),
);
//

export default app;
