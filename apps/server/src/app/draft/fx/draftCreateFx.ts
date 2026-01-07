import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { draftFetchFx } from "~/app/draft/fx/draftFetchFx";
import type { DraftCreateSchema } from "~/app/draft/schema/DraftCreateSchema";
import { galleryCreateFx as coolGalleryCreateFx } from "~/app/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
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
			const kysely = yield* KyselyContextFx;

			const id = genId();
			const now = new Date();

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
						createdAt: now,
						updatedAt: now,
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
