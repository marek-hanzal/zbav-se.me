import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withBuyerUserApiFx = Effect.fn("withBuyerUserApiFx")(function* () {
	const { root, buyerUserHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	buyerUserHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/buyer-user/*", async (c, next) => {
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

	root.route("/api/buyer-user", buyerUserHono);
});
