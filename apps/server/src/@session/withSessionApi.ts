import type { WithDatabase } from "../database/WithDatabase";
import type { Routes } from "../hono/Routes";
import type { MessageSchema } from "../schema/MessageSchema";
import { withCategoryApi } from "./category/withCategoryApi";
import { withLocationApi } from "./location/withLocationApi";

export const withSessionApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = (routes, deps) => {
	routes.sessionHono.use(async (c, next) => {
		c.set("database", deps.database);
		return next();
	});

	routes.root.use("/api/session/*", async (c, next) => {
		const session = c.get("session");
		const user = c.get("user");
		if (!session || !user) {
			return c.json<MessageSchema.Type, 401>(
				{
					type: "error",
					message: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	withCategoryApi(routes);
	withLocationApi(routes);

	routes.root.route("/api/session", routes.sessionHono);
};
