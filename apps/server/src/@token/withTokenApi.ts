import { AppEnv } from "../AppEnv";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { PayloadSchema } from "../jwt/PayloadSchema";
import { verify } from "../jwt/verify";

export const withTokenApi: Routes.Fn = (routes) => {
	routes.root.route("/api/token", routes.tokenHono);

	routes.root.use("/api/token/*", async (c, next) => {
		const [, token] = c.req.header("Authorization")?.split(" ") ?? [];

		if (!token) {
			return c.json(
				{
					error: "Shooooo! Shooo!",
				},
				401,
			);
		}

		try {
			const { payload } = await verify(token, {
				issuer: AppEnv.VITE_SERVER_API,
				secret: AppEnv.SERVER_JWT_SECRET,
				scope: c.req.path,
				schema: PayloadSchema,
			});

			c.set(
				"user",
				await database.kysely
					.selectFrom("user")
					.where("id", "=", payload.userId)
					.selectAll()
					.executeTakeFirstOrThrow(),
			);

			return next();
		} catch {
			return c.json(
				{
					error: "Shooooo! Shooo!",
				},
				401,
			);
		}
	});
};
