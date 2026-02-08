import { Effect } from "effect";
import { withDraftApiFx } from "~/@seller-user/draft/withDraftApiFx";
import { withDraftGalleryApiFx } from "~/@seller-user/draft-gallery/withDraftGalleryApiFx";
import { withListingApiFx } from "~/@seller-user/listing/withListingApiFx";
import { withTransactionApiFx } from "~/@seller-user/transaction/withTransactionApiFx";
import { withTransactionListingApiFx } from "~/@seller-user/transaction-listing/withTransactionListingApiFx";
import { withTransactionStatusApiFx } from "~/@seller-user/transaction-status/withTransactionStatusApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

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

	root.route("/api/seller-user", sellerUserHono);
});
