import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withListingApiFx } from "./listing/withListingApiFx";

export const withSellerSessionApiFx = Effect.fn("withSellerSessionApiFx")(function* () {
	const { root, sellerSessionHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	sellerSessionHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/seller-session/*", async (c, next) => {
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

	yield* withListingApiFx();

	root.route("/api/seller-session", sellerSessionHono);
});
