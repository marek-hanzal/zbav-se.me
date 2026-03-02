import { Effect } from "effect";
import { withDraftApiFx } from "~/@seller/draft/withDraftApiFx";
import { withDraftGalleryApiFx } from "~/@seller/draft-gallery/withDraftGalleryApiFx";
import { withListingApiFx } from "~/@seller/listing/withListingApiFx";
import { withTransactionApiFx } from "~/@seller/transaction/withTransactionApiFx";
import { withTransactionListingApiFx } from "~/@seller/transaction-listing/withTransactionListingApiFx";
import { withTransactionStatusApiFx } from "~/@seller/transaction-status/withTransactionStatusApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withSellerApiFx = Effect.fn("withSellerApiFx")(function* () {
	const { root, sellerHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	sellerHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/seller/*", async (c, next) => {
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
		withDraftApiFx(),
		withDraftGalleryApiFx(),
		withListingApiFx(),
		withTransactionApiFx(),
		withTransactionListingApiFx(),
		withTransactionStatusApiFx(),
	]);

	root.route("/api/seller", sellerHono);
});
