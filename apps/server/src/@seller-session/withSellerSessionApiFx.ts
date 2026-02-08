import { Effect } from "effect";
import { withTransactionApiFx } from "~/@seller-session/transaction/withTransactionApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

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

	yield* withTransactionApiFx();

	root.route("/api/seller-session", sellerSessionHono);
});
