import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { categoryRoot } from "./category/categoryRoot";
import { categoryGroupRoot } from "./category-group/categoryGroupRoot";
import { healthRoot } from "./health/healthRoute";
import { migrationRoot } from "./migration/migrationRoute";
import { withOpenApi } from "./open-api/withOpenApi";

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
declare const __ORIGIN__: string;
declare const __COOKIE__: string;

const app = withOpenApi(new OpenAPIHono());

//
app.use(requestId());
app.use(secureHeaders());
app.use(
	cors({
		origin: __ORIGIN__,
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
app.route("/", categoryGroupRoot);
app.route("/", categoryRoot);
app.route("/", migrationRoot);
app.route("/", healthRoot);
app.get("/cookie", (c) => {
	setCookie(c, "zbav-se.me", "1", {
		httpOnly: true,
		secure: true,
		sameSite: "Lax",
		path: "/",
		domain: __COOKIE__,
		maxAge: 60 * 60,
	});
	c.header("Cache-Control", "no-store");

	return c.json({
		message: "yep",
	});
});
app.get("/origin", (c) =>
	c.json({
		origin: __ORIGIN__,
	}),
);
//

export default app;
