import { OpenAPIHono } from "@hono/zod-openapi";
import { categoryRoot } from "./category/categoryRoot";
import { categoryGroupRoot } from "./category-group/categoryGroupRoot";
import { healthRoot } from "./health/healthRoute";
import { migrationRoot } from "./migration/migrationRoute";
import { withOpenApi } from "./open-api/withOpenApi";

const app = withOpenApi(new OpenAPIHono());

//
app.route("/", categoryGroupRoot);
app.route("/", categoryRoot);
app.route("/", migrationRoot);
app.route("/", healthRoot);
//

export default app;
