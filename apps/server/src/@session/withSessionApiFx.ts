import { Effect } from "effect";
import { withCategoryApiFx } from "~/@session/category/withCategoryApiFx";
import { withLocationApiFx } from "~/@session/location/withLocationApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withSessionApiFx = Effect.fn("withSessionApiFx")(function* () {
	const { root, sessionHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	sessionHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/session/*", async (c, next) => {
		const user = c.get("user");

		if (!user) {
			return c.json(
				{
					type: "error",
					message: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	yield* Effect.all([
		withCategoryApiFx(),
		withLocationApiFx(),
	]);

	root.route("/api/session", sessionHono);
});
