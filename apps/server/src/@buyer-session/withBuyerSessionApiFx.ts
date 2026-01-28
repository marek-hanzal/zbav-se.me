import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withListingApiFx } from "./listing/withListingApiFx";
import { withListingEventApiFx } from "./listing-event/withListingEventApiFx";
import { withTransactionApiFx } from "./transaction/withTransactionApiFx";

export const withBuyerSessionApiFx = Effect.fn("withBuyerSessionApiFx")(function* () {
	const { root, buyerSessionHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	buyerSessionHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/buyer-session/*", async (c, next) => {
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
		withListingApiFx(),
		withListingEventApiFx(),
		withTransactionApiFx(),
	]);

	root.route("/api/buyer-session", buyerSessionHono);
});
