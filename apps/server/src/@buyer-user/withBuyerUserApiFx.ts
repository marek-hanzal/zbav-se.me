import { Effect } from "effect";
import { withFavouriteApiFx } from "~/@buyer-user/favourite/withFavouriteApiFx";
import { withFeedApiFx } from "~/@buyer-user/feed/withFeedApiFx";
import { withFeedFavouriteApiFx } from "~/@buyer-user/feed-favourite/withFeedFavouriteApiFx";
import { withFeedGalleryApiFx } from "~/@buyer-user/feed-gallery/withFeedGalleryApiFx";
import { withFlagApiFx } from "~/@buyer-user/flag/withFlagApiFx";
import { withIgnoreApiFx } from "~/@buyer-user/ignore/withIgnoreApiFx";
import { withListingApiFx } from "~/@buyer-user/listing/withListingApiFx";
import { withThumbApiFx } from "~/@buyer-user/thumb/withThumbApiFx";
import { withTransactionApiFx } from "~/@buyer-user/transaction/withTransactionApiFx";
import { withTransactionStatusApiFx } from "~/@buyer-user/transaction-status/withTransactionStatusApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withBuyerUserApiFx = Effect.fn("withBuyerUserApiFx")(function* () {
	const { root, buyerUserHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	buyerUserHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/buyer-user/*", async (c, next) => {
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
		withFavouriteApiFx(),
		withFeedApiFx(),
		withFeedFavouriteApiFx(),
		withFeedGalleryApiFx(),
		withFlagApiFx(),
		withIgnoreApiFx(),
		withListingApiFx(),
		withThumbApiFx(),
		withTransactionApiFx(),
		withTransactionStatusApiFx(),
	]);

	root.route("/api/buyer-user", buyerUserHono);
});
