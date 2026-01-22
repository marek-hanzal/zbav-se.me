import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { DraftCreateSchema } from "~/@session/draft/schema/DraftCreateSchema";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@session/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@session/gallery-item/fx/galleryItemCreateFx";
import { draftFetchFx } from "~/@user/draft/fx/draftFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace draftCreateFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const draftCreateFx = Effect.fn("draftCreateFx")(function* ({
	userId,
	...data
}: draftCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			const gallery = yield* coolGalleryCreateFx({
				userId,
			});

			if (data.uploadIds && data.uploadIds.length > 0) {
				let sort = 0;
				for (const uploadId of data.uploadIds) {
					yield* galleryItemCreateFx({
						galleryId: gallery.id,
						uploadId,
						sort,
						userId,
					});
					sort++;
				}
			}

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("draft")
					.values({
						...data,
						userId,
						id,
						galleryId: gallery.id,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						currency: "CZK",
					})
					.execute();
			});

			return yield* draftFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type draftCreateFx = ReturnType<typeof draftCreateFx>;
