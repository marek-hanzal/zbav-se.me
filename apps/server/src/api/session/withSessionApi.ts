import type { Routes } from "../../hono/Routes";

export const withSessionApi: Routes.Fn = (routes) => {
	routes.root.route("/api/session", routes.sessionHono);

	routes.root.use("/api/session/*", async (c, next) => {
		const session = c.get("session");
		const user = c.get("user");
		if (!session || !user) {
			return c.json(
				{
					error: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});
};
