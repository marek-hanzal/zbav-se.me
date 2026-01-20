import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { GalleryItemSortSchema } from "~/app/gallery-item/schema/GalleryItemSortSchema";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withGalleryItemSelectFx {
	export interface Props {
		sort?: GalleryItemSortSchema.Type[];
	}
	export type Select = Effect.Effect.Success<ReturnType<typeof withGalleryItemSelectFx>>;
}

export const withGalleryItemSelectFx = Effect.fn("withGalleryItemSelectFx")(function* ({
	sort,
}: withGalleryItemSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const uploadSelect = yield* withUploadSelectFx({});

	let query = kysely.selectFrom("gallery_item as gal_item").select([
		"gal_item.id",
		"gal_item.galleryId",
		"gal_item.uploadId",
		"gal_item.sort",
		(eb) =>
			jsonObjectFrom(uploadSelect.whereRef("u.id", "=", eb.ref("gal_item.uploadId")).limit(1))
				.$notNull()
				.as("upload"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("gal_item.sort", item.direction))
			.with("createdAt", () => query.orderBy("gal_item.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
