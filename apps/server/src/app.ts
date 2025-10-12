import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { withCategoryApi } from "./category/withCategoryApi";
import { withCategoryGroupApi } from "./category-group/withCategoryGroupApi";
import { AppEnv } from "./env";
import { withHealthApi } from "./health/withHealthApi";
import { withLocationApi } from "./location/withLocationApi";
import { withMigrationApi } from "./migration/withMigrationApi";
import { withOpenApi } from "./open-api/withOpenApi";

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
const app = withOpenApi(new OpenAPIHono());

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
app.route("/api", withCategoryGroupApi);
app.route("/api", withCategoryApi);
app.route("/api", withLocationApi);
app.route("/api", withMigrationApi);
app.route("/api", withHealthApi);
//
app.get("/origin", (c) =>
	c.json({
		origin: AppEnv.ORIGIN,
	}),
);
//

export default app;
