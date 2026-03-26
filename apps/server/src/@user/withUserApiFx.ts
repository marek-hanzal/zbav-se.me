import { Effect } from "effect";
import { UnauthorizedNotice } from "~/@common/notice/UnauthorizedNotice";
import { withGalleryApiFx } from "~/@user/gallery/withGalleryApiFx";
import { withS3ApiFx } from "~/@user/s3/withS3ApiFx";
import { withTransactionEntryApiFx } from "~/@user/transaction-entry/withTransactionEntryApiFx";
import { withUploadApiFx } from "~/@user/upload/withUploadApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withUserApiFx = Effect.fn("withUserApiFx")(function* () {
	const { root, userHono } = yield* RoutesContextFx;

	root.use("/api/user/*", async (c, next) => {
		if (!c.get("user")) {
			return c.json(UnauthorizedNotice, 401);
		}

		return next();
	});

	yield* Effect.all([
		withGalleryApiFx(),
		// withInboxApiFx(),
		withS3ApiFx(),
		withTransactionEntryApiFx(),
		withUploadApiFx(),
		// withUserExApiFx(),
	]);

	root.route("/api/user", userHono);
});
