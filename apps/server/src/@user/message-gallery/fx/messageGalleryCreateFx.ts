import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { MessageGalleryCreateSchema } from "~/@user/message-gallery/schema/MessageGalleryCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { messageGalleryFetchFx } from "./messageGalleryFetchFx";

export namespace messageGalleryCreateFx {
	export interface Props extends MessageGalleryCreateSchema.Type {
		userId: string;
	}
}

export const messageGalleryCreateFx = Effect.fn("messageGalleryCreateFx")(function* ({
	userId,
	messageThreadId,
	galleryId,
}: messageGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

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
						createdAt: dateContext.now().toJSDate(),
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
