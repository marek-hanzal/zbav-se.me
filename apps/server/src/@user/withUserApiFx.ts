import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withGalleryApiFx } from "./gallery/withGalleryApiFx";
import { withMessageThreadApiFx } from "./message-thread/withMessageThreadApiFx";
import { withS3ApiFx } from "./s3/withS3ApiFx";
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
		withGalleryApiFx(),
		withMessageThreadApiFx(),
		withS3ApiFx(),
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
