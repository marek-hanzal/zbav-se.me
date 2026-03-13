import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { draftFetchFx } from "~/@seller/draft/fx/draftFetchFx";
import type { DraftCreateSchema } from "~/@seller/draft/schema/DraftCreateSchema";
import { galleryInsertFx } from "~/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace draftCreateFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const draftCreateFx = Effect.fn("draftCreateFx")(function* ({
	userId,
	uploadIds,
	...data
}: draftCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			const gallery = yield* galleryInsertFx({
				userId,
			});

			if (uploadIds && uploadIds.length > 0) {
				let sort = 0;
				for (const uploadId of uploadIds) {
					yield* galleryItemInsertFx({
						galleryId: gallery.id,
						uploadId,
						sort,
						userId,
						check: false,
					});
					sort++;
				}
			}

			yield* tryDbFx(async () => {
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
