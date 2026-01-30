import { Effect } from "effect";
import { withBoardItemApiFx } from "~/@arkini/board-item/withBoardItemApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withArkiniApiFx = Effect.fn("withArkiniApiFx")(function* () {
	const { root, arkiniHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	arkiniHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/arkini/*", async (c, next) => {
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

	yield* withBoardItemApiFx();

	root.route("/api/arkini", arkiniHono);
});
