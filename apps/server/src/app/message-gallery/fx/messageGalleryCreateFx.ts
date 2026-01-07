import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageGalleryFetchFx } from "~/app/message-gallery/fx/messageGalleryFetchFx";
import type { MessageGalleryCreateSchema } from "~/app/message-gallery/schema/MessageGalleryCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageGalleryCreateFx {
	export interface Props extends MessageGalleryCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const messageGalleryCreateFx = Effect.fn("messageGalleryCreateFx")(function* ({
	userId,
	messageThreadId,
	galleryId,
	createdAt,
}: messageGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			yield* messageUserCheckFx({
				userIds: [
					userId,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("message_gallery")
					.values({
						id,
						messageThreadId,
						userId,
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
				userId,
				scope: {
					userId,
				},
			});
		}),
	);
});

export type messageGalleryCreateFx = ReturnType<typeof messageGalleryCreateFx>;
