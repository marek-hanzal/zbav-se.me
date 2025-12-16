import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { DraftCreateSchema } from "~/@user/draft/schema/DraftCreateSchema";
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

			const gallery = yield* coolGalleryCreateFx();

			// Add gallery items if provided
			if (data.uploadIds && data.uploadIds.length > 0) {
				let sort = 0;
				for (const uploadId of data.uploadIds) {
					yield* galleryItemCreateFx({
						galleryId: gallery.id,
						uploadId,
						sort,
					});
					sort++;
				}
			}

			// Create draft with galleryId
			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("draft")
					.values({
						id,
						userId: user.id,
						galleryId: gallery.id,
						createdAt: now,
						updatedAt: now,
						currency: "CZK",
						...data,
					})
					.execute();
			});

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
