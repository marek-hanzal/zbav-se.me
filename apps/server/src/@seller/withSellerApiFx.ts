import { Effect } from "effect";
import { UnauthorizedNotice } from "~/@common/notice/UnauthorizedNotice";
import { withDraftApiFx } from "~/@seller/draft/withDraftApiFx";
import { withDraftGalleryApiFx } from "~/@seller/draft-gallery/withDraftGalleryApiFx";
import { withListingApiFx } from "~/@seller/listing/withListingApiFx";
import { withTransactionApiFx } from "~/@seller/transaction/withTransactionApiFx";
import { withTransactionListingApiFx } from "~/@seller/transaction-listing/withTransactionListingApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withSellerApiFx = Effect.fn("withSellerApiFx")(function* () {
	const { root, sellerHono } = yield* RoutesContextFx;

	root.use("/api/seller/*", async (c, next) => {
		if (!c.get("user")) {
			return c.json(UnauthorizedNotice, 401);
		}

		return next();
	});

	yield* Effect.all([
		withDraftApiFx(),
		withDraftGalleryApiFx(),
		withListingApiFx(),
		withTransactionApiFx(),
		withTransactionListingApiFx(),
	]);

	root.route("/api/seller", sellerHono);
});
