import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withDraftApiFx } from "./draft/withDraftApiFx";
import { withFavouriteApiFx } from "./favourite/withFavouriteApiFx";
import { withFeedApiFx } from "./feed/withFeedApiFx";
import { withFeedFavouriteApiFx } from "./feed-favourite/withFeedFavouriteApiFx";
import { withFlagApiFx } from "./flag/withFlagApiFx";
import { withGalleryApiFx } from "./gallery/withGalleryApiFx";
import { withIgnoreApiFx } from "./ignore/withIgnoreApiFx";
import { withMessageThreadApiFx } from "./message-thread/withMessageThreadApiFx";
import { withS3ApiFx } from "./s3/withS3ApiFx";
import { withThumbApiFx } from "./thumb/withThumbApiFx";
import { withTransactionApiFx } from "./transaction/withTransactionApiFx";
import { withTransactionListingApiFx } from "./transaction-listing/withTransactionListingApiFx";
import { withTransactionMessageGalleryApiFx } from "./transaction-message-gallery/withTransactionMessageGalleryApiFx";
import { withTransactionMessageLocationApiFx } from "./transaction-message-location/withTransactionMessageLocationApiFx";
import { withTransactionMessagePackageApiFx } from "./transaction-message-package/withTransactionMessagePackageApiFx";
import { withTransactionMessagePersonalApiFx } from "./transaction-message-personal/withTransactionMessagePersonalApiFx";
import { withTransactionMessageTextApiFx } from "./transaction-message-text/withTransactionMessageTextApiFx";
import { withTransactionStatusApiFx } from "./transaction-status/withTransactionStatusApiFx";
import { withUploadApiFx } from "./upload/withUploadApiFx";
import { withUserExApiFx } from "./user-ex/withUserExApiFx";

export const withUserApiFx = Effect.fn("withUserApiFx")(function* () {
	const { root, userHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	userHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/user/*", async (c, next) => {
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
		withFavouriteApiFx(),
		withFeedApiFx(),
		withFeedFavouriteApiFx(),
		withFlagApiFx(),
		withGalleryApiFx(),
		withIgnoreApiFx(),
		withMessageThreadApiFx(),
		withS3ApiFx(),
		withThumbApiFx(),
		withTransactionApiFx(),
		withTransactionListingApiFx(),
		withTransactionMessageGalleryApiFx(),
		withTransactionMessageLocationApiFx(),
		withTransactionMessagePackageApiFx(),
		withTransactionMessagePersonalApiFx(),
		withTransactionMessageTextApiFx(),
		withTransactionStatusApiFx(),
		withUploadApiFx(),
		withUserExApiFx(),
	]);

	root.route("/api/user", userHono);
});
