import { Effect } from "effect";
import { withFavouriteApiFx } from "~/@buyer/favourite/withFavouriteApiFx";
import { withFeedApiFx } from "~/@buyer/feed/withFeedApiFx";
import { withFeedFavouriteApiFx } from "~/@buyer/feed-favourite/withFeedFavouriteApiFx";
import { withFeedGalleryApiFx } from "~/@buyer/feed-gallery/withFeedGalleryApiFx";
import { withFlagApiFx } from "~/@buyer/flag/withFlagApiFx";
import { withIgnoreApiFx } from "~/@buyer/ignore/withIgnoreApiFx";
import { withListingApiFx } from "~/@buyer/listing/withListingApiFx";
import { withListingEventApiFx } from "~/@buyer/listing-event/withListingEventApiFx";
import { withThumbApiFx } from "~/@buyer/thumb/withThumbApiFx";
import { withTransactionApiFx } from "~/@buyer/transaction/withTransactionApiFx";
import { withTransactionStatusApiFx } from "~/@buyer/transaction-status/withTransactionStatusApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withBuyerApiFx = Effect.fn("withBuyerApiFx")(function* () {
	const { root, buyerHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	buyerHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/buyer/*", async (c, next) => {
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
		withFavouriteApiFx(),
		withFeedApiFx(),
		withFeedFavouriteApiFx(),
		withFeedGalleryApiFx(),
		withFlagApiFx(),
		withIgnoreApiFx(),
		withListingApiFx(),
		withListingEventApiFx(),
		withThumbApiFx(),
		withTransactionApiFx(),
		withTransactionStatusApiFx(),
	]);

	root.route("/api/buyer", buyerHono);
});
