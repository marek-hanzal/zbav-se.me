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
import { UnauthorizedNotice } from "~/@common/notice/UnauthorizedNotice";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withBuyerApiFx = Effect.fn("withBuyerApiFx")(function* () {
	const { root, buyerHono } = yield* RoutesContextFx;

	root.use("/api/buyer/*", async (c, next) => {
		if (!c.get("user")) {
			return c.json(UnauthorizedNotice, 401);
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
	]);

	root.route("/api/buyer", buyerHono);
});
