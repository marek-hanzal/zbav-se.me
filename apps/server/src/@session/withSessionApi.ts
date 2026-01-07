import type { WithDatabase } from "../database/WithDatabase";
import type { Routes } from "../hono/Routes";
import type { NoticeSchema } from "../schema/NoticeSchema";
import { withCategoryApi } from "./category/withCategoryApi";
import { withListingApi } from "./listing/withListingApi";
import { withLocationApi } from "./location/withLocationApi";
import { withUploadApi } from "./upload/withUploadApi";
import { withUserEventApi } from "./user-event/withUserEventApi";

export const withSessionApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = async (routes, deps) => {
	routes.sessionHono.use(async (c, next) => {
		c.set("database", deps.database);
		return next();
	});

	routes.root.use("/api/session/*", async (c, next) => {
		const session = c.get("session");
		const user = c.get("user");
		if (!session || !user) {
			return c.json<NoticeSchema.Type, 401>(
				{
					type: "error",
					message: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	await withCategoryApi(routes);
	await withListingApi(routes);
	await withLocationApi(routes);
	await withUploadApi(routes);
	await withUserEventApi(routes);

	routes.root.route("/api/session", routes.sessionHono);
};
