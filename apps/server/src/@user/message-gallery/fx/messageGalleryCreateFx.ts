import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageGalleryFetchFx } from "~/@user/message-gallery/fx/messageGalleryFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { MessageGalleryCreateSchema } from "../schema/MessageGalleryCreateSchema";

export namespace messageGalleryCreateFx {
	export interface Props extends MessageGalleryCreateSchema.Type {
		createdAt?: DateTime;
	}
}

export const messageGalleryCreateFx = Effect.fn("messageGalleryCreateFx")(function* ({
	messageThreadId,
	galleryId,
	createdAt,
}: messageGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			yield* messageUserCheckFx({
				userIds: [
					user.id,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return database
					.insertInto("message_gallery")
					.values({
						id,
						messageThreadId,
						userId: user.id,
						galleryId,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageGalleryFetchFx({
				where: {
					id,
				},
			});
		}),
	);
});

export type messageGalleryCreateFx = ReturnType<typeof messageGalleryCreateFx>;
