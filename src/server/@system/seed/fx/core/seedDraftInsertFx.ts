import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { seedGalleryItemBulkInsertFx } from "~/server/@system/seed/fx/core/seedGalleryItemBulkInsertFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

export namespace seedDraftInsertFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const seedDraftInsertFx = Effect.fn("seedDraftInsertFx")(function* ({
	userId,
	uploadIds,
	...data
}: seedDraftInsertFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();
	const id = genId();

	const gallery = yield* galleryInsertFx({
		access: "private",
		userId,
	});

	yield* seedGalleryItemBulkInsertFx({
		galleryId: gallery.id,
		uploadIds: uploadIds ?? [],
	});

	yield* tryDbFx(async () =>
		kysely
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
			.execute(),
	);

	return {
		id,
	};
});

export type seedDraftInsertFx = ReturnType<typeof seedDraftInsertFx>;
