import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { DraftCreateSchema } from "~/@user/draft/schema/DraftCreateSchema";
import { draftGalleryCreateFx } from "~/@user/draft-gallery/fx/draftGalleryCreateFx";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { draftFetchFx } from "./draftFetchFx";

export namespace draftCreateFx {
	export type Props = DraftCreateSchema.Type;
}

export const draftCreateFx = (data: draftCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const id = genId();
			const now = new Date();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("draft")
					.values({
						id,
						userId: user.id,
						createdAt: now,
						updatedAt: now,
						currency: "CZK",
						...data,
					})
					.execute();
			});

			if (data.uploadIds && data.uploadIds.length > 0) {
				const gallery = yield* coolGalleryCreateFx();

				let sort = 0;
				for (const uploadId of data.uploadIds) {
					yield* galleryItemCreateFx({
						galleryId: gallery.id,
						uploadId,
						sort,
					});
					sort++;
				}

				yield* draftGalleryCreateFx({
					draftId: id,
					galleryId: gallery.id,
				});
			}

			return yield* draftFetchFx({
				where: {
					id,
					userId: user.id,
				},
			});
		}),
	);
};

export type draftCreateFx = ReturnType<typeof draftCreateFx>;
