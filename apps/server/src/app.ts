import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { categoryRoot } from "./category/categoryRoot";
import { categoryGroupRoot } from "./category-group/categoryGroupRoot";
import { healthRoot } from "./health/healthRoute";
import { migrationRoot } from "./migration/migrationRoute";
import { withOpenApi } from "./open-api/withOpenApi";

const app = withOpenApi(new OpenAPIHono());

//
app.use(requestId());
app.use(secureHeaders());
app.use(
	cors({
		origin: "*",
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
		credentials: false,
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
//

export default app;
