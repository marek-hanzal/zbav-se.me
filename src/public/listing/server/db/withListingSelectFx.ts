import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";

export namespace withListingSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {
		//
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const listingSourceSelect = yield* withListingSourceSelectFx({
		sort,
		meta,
		hasExplicitCategory,
	});

	const gallerySelect = yield* withGallerySelectFx({});

	return listingSourceSelect.select((eb) => [
		"l.id",
		"l.title",
		"l.price",
		"l.priceType",
		"l.currency",
		"l.createdAt",
		sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategoryTableSchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
		jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
			.$notNull()
			.as("gallery"),
	]);
});
