import { auth } from "../auth/auth";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withAuthApi } from "./auth/withAuthApi";
import { withCorsApi } from "./cors/withCorsApi";
import { withOpenApiApi } from "./open-api/withOpenApiApi";
import { withOriginApi } from "./origin/withOriginApi";

export const withRootApi: Routes.Fn = (routes) => {
	routes.root.use(async (c, next) => {
		c.set("database", database.kysely);

		try {
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
		} catch {
			c.set("user", null);
			c.set("session", null);
			return next();
		}
	});

	withAuthApi(routes);
	withCorsApi(routes);
	withOpenApiApi(routes);
	withOriginApi(routes);
};
