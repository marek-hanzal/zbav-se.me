import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withFavouriteApiFx } from "./favourite/withFavouriteApiFx";
import { withFeedApiFx } from "./feed/withFeedApiFx";
import { withFeedFavouriteApiFx } from "./feed-favourite/withFeedFavouriteApiFx";
import { withFeedGalleryApiFx } from "./feed-gallery/withFeedGalleryApiFx";
import { withFlagApiFx } from "./flag/withFlagApiFx";
import { withIgnoreApiFx } from "./ignore/withIgnoreApiFx";
import { withListingApiFx } from "./listing/withListingApiFx";
import { withThumbApiFx } from "./thumb/withThumbApiFx";
import { withTransactionApiFx } from "./transaction/withTransactionApiFx";
import { withTransactionStatusApiFx } from "./transaction-status/withTransactionStatusApiFx";

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
