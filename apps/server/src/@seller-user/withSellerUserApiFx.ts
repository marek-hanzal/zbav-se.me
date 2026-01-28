import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withDraftApiFx } from "./draft/withDraftApiFx";
import { withDraftGalleryApiFx } from "./draft-gallery/withDraftGalleryApiFx";
import { withListingApiFx } from "./listing/withListingApiFx";
import { withTransactionApiFx } from "./transaction/withTransactionApiFx";
import { withTransactionListingApiFx } from "./transaction-listing/withTransactionListingApiFx";
import { withTransactionStatusApiFx } from "./transaction-status/withTransactionStatusApiFx";

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
		withDraftApiFx(),
		withDraftGalleryApiFx(),
		withListingApiFx(),
		withTransactionApiFx(),
		withTransactionListingApiFx(),
		withTransactionStatusApiFx(),
	]);

	root.route("/api/seller-user", sellerUserHono);
});
