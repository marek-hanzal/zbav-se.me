import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withCategoryApiFx } from "./category/withCategoryApiFx";
import { withLocationApiFx } from "./location/withLocationApiFx";

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

	yield* Effect.all([
		withCategoryApiFx(),
		withLocationApiFx(),
	]);

	root.route("/api/session", sessionHono);
});
