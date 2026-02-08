import { Effect } from "effect";
import { withListingApiFx } from "~/@buyer-session/listing/withListingApiFx";
import { withListingEventApiFx } from "~/@buyer-session/listing-event/withListingEventApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

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

	yield* withListingApiFx();
	yield* withListingEventApiFx();

	root.route("/api/buyer-session", buyerSessionHono);
});
