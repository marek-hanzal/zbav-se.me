import { dialect } from "~/database/dialect";
import { auth } from "../auth/auth";
import type { WithDatabase } from "../database/WithDatabase";
import type { Routes } from "../hono/Routes";
import { withAuthApi } from "./auth/withAuthApi";
import { withCorsApi } from "./cors/withCorsApi";
import { withOpenApiApi } from "./open-api/withOpenApiApi";
import { withOriginApi } from "./origin/withOriginApi";

export const withRootApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = async (routes, deps) => {
	routes.root.use(async (c, next) => {
		c.set("database", deps.database);
		const { api } = await auth(async () => dialect);

		try {
			const session = await api.getSession({
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

	await withAuthApi(routes);
	await withCorsApi(routes);
	await withOpenApiApi(routes);
	await withOriginApi(routes);
};
