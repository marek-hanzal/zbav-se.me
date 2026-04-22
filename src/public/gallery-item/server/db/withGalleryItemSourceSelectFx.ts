import { Effect } from "effect";
import { match } from "ts-pattern";
import type { GalleryItemSortSchema } from "~/public/gallery-item/server/schema/GalleryItemSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withGalleryItemSourceSelectFx {
	export interface Props {
		sort?: GalleryItemSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGalleryItemSourceSelectFx>>;
}

export const withGalleryItemSourceSelectFx = Effect.fn("withGalleryItemSourceSelectFx")(function* ({
	sort,
}: withGalleryItemSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("gallery_item as gal_item");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("gal_item.sort", item.order))
			.with("createdAt", () => query.orderBy("gal_item.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
