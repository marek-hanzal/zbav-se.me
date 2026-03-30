import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace seedGalleryItemBulkInsertFx {
	export interface Props {
		galleryId: string;
		uploadIds: string[];
	}
}

export const seedGalleryItemBulkInsertFx = Effect.fn("seedGalleryItemBulkInsertFx")(function* ({
	galleryId,
	uploadIds,
}: seedGalleryItemBulkInsertFx.Props) {
	if (uploadIds.length === 0) {
		return 0;
	}

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	const rows = uploadIds.map((uploadId, sort) => ({
		id: genId(),
		galleryId,
		uploadId,
		sort,
		createdAt: now,
	}));

	yield* tryDbFx(async () => kysely.insertInto("gallery_item").values(rows).execute());

	return rows.length;
});

export type seedGalleryItemBulkInsertFx = ReturnType<typeof seedGalleryItemBulkInsertFx>;
