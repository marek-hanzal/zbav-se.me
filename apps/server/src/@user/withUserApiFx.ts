import { Effect } from "effect";
import { withGalleryApiFx } from "~/@user/gallery/withGalleryApiFx";
import { withInboxApiFx } from "~/@user/inbox/withInboxApiFx";
import { withMessageApiFx } from "~/@user/message/withMessageApiFx";
import { withS3ApiFx } from "~/@user/s3/withS3ApiFx";
import { withUploadApiFx } from "~/@user/upload/withUploadApiFx";
import { withUserExApiFx } from "~/@user/user-ex/withUserExApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

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
		withGalleryApiFx(),
		withInboxApiFx(),
		withMessageApiFx(),
		withS3ApiFx(),
		withUploadApiFx(),
		withUserExApiFx(),
	]);

	root.route("/api/user", userHono);
});
