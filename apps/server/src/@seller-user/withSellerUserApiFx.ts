import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withSellerUserApiFx = Effect.fn("withSellerUserApiFx")(function* () {
	const { root, sellerUserHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	sellerUserHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/seller-user/*", async (c, next) => {
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

	root.route("/api/seller-user", sellerUserHono);
});
