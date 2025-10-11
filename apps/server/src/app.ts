import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoot } from "./health/healthRoute";
import { migrationRoot } from "./migration/migrationRoute";
import { withOpenApi } from "./open-api/withOpenApi";

const app = withOpenApi(new OpenAPIHono());

//
app.route("/", healthRoot);
app.route("/", migrationRoot);
//

export default app;
