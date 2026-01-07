import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { GallerySortSchema } from "~/app/gallery/schema/GallerySortSchema";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withGallerySelectFx {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}
	export type Select = Effect.Effect.Success<ReturnType<typeof withGallerySelectFx>>;
}

export const withGallerySelectFx = Effect.fn("withGallerySelectFx")(function* ({
	sort,
}: withGallerySelectFx.Props) {
	const kysely = yield* KyselyContextFx;
	const galleryItemSelect = yield* withGalleryItemSelectFx({
		sort: [
			{
				field: "sort",
				direction: "asc",
			},
		],
	});

	let query = kysely.selectFrom("gallery as gal").select([
		"gal.id",
		(eb) =>
			jsonArrayFrom(
				galleryItemSelect.whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
			).as("items"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("gal.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
