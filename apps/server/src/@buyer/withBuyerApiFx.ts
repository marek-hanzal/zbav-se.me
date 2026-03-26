import { Effect } from "effect";
import { withFeedFavouriteApiFx } from "~/@buyer/feed-favourite/withFeedFavouriteApiFx";
import { withFeedGalleryApiFx } from "~/@buyer/feed-gallery/withFeedGalleryApiFx";
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
		// withFavouriteApiFx(),
		// withFeedApiFx(),
		withFeedFavouriteApiFx(),
		withFeedGalleryApiFx(),
		// withFlagApiFx(),
		// withIgnoreApiFx(),
		// withListingApiFx(),
		// withListingEventApiFx(),
		// withThumbApiFx(),
		withTransactionApiFx(),
	]);

	root.route("/api/buyer", buyerHono);
});
