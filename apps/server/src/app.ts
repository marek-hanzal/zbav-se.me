import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { categoryRoot } from "./category/categoryRoot";
import { categoryGroupRoot } from "./category-group/categoryGroupRoot";
import { AppEnv } from "./env";
import { healthRoot } from "./health/healthRoute";
import { locationRoot } from "./location/locationRoot";
import { migrationRoot } from "./migration/migrationRoute";
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
app.route("/api", categoryGroupRoot);
app.route("/api", categoryRoot);
app.route("/api", locationRoot);
app.route("/api", migrationRoot);
app.route("/api", healthRoot);
//
app.get("/origin", (c) =>
	c.json({
		origin: AppEnv.ORIGIN,
	}),
);
//

export default app;
