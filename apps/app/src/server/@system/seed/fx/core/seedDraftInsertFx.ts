import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { seedGalleryItemBulkInsertFx } from "~/seed/fx/core/seedGalleryItemBulkInsertFx";
import type { DraftCreateSchema } from "~/server/@seller/draft/schema/DraftCreateSchema";
import { galleryInsertFx } from "~/server/@user/gallery/fx/galleryInsertFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

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
