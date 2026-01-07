import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DraftCreateSchema } from "~/@user/draft/schema/DraftCreateSchema";
import { draftFetchFx } from "~/app/draft/fx/draftFetchFx";
import { galleryCreateFx as coolGalleryCreateFx } from "~/app/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;

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
				return database
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

