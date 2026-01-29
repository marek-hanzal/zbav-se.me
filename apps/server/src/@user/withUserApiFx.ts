import { Effect } from "effect";
import { withGalleryApiFx } from "~/@user/gallery/withGalleryApiFx";
import { withMessageThreadApiFx } from "~/@user/message-thread/withMessageThreadApiFx";
import { withS3ApiFx } from "~/@user/s3/withS3ApiFx";
import { withTransactionMessageGalleryApiFx } from "~/@user/transaction-message-gallery/withTransactionMessageGalleryApiFx";
import { withTransactionMessageLocationApiFx } from "~/@user/transaction-message-location/withTransactionMessageLocationApiFx";
import { withTransactionMessagePackageApiFx } from "~/@user/transaction-message-package/withTransactionMessagePackageApiFx";
import { withTransactionMessagePersonalApiFx } from "~/@user/transaction-message-personal/withTransactionMessagePersonalApiFx";
import { withTransactionMessageTextApiFx } from "~/@user/transaction-message-text/withTransactionMessageTextApiFx";
import { withUploadApiFx } from "~/@user/upload/withUploadApiFx";
import { withUserExApiFx } from "~/@user/user-ex/withUserExApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

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
		withUploadApiFx(),
		withUserExApiFx(),
	]);

	root.route("/api/user", userHono);
});
