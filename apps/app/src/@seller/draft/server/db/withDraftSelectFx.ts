import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { ListingDeliveryEnumSchema } from "~/@common/listing/enum/ListingDeliveryEnumSchema";
import { withDraftSourceSelectFx } from "~/@seller/draft/server/db/withDraftSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/server/db/withGallerySelectFx";
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";

export namespace withDraftSelectFx {
	export interface Props extends withDraftSourceSelectFx.Props {}

	export type Select = ReturnType<typeof withDraftSelectFx>;
}

export const withDraftSelectFx = Effect.fn("withDraftSelectFx")(function* ({
	sort,
}: withDraftSelectFx.Props) {
	const draftSourceSelect = yield* withDraftSourceSelectFx({
		sort,
	});

	const gallerySelect = yield* withGallerySelectFx({});

	return draftSourceSelect.selectAll("d").select((eb) => [
		sql<LocationTableSchema.Type | null>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategoryTableSchema.Type | null>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
		sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("d.delivery")})`.as(
			"delivery",
		),
		sql<string[] | null>`to_jsonb(${eb.ref("d.pros")})`.as("pros"),
		sql<string[] | null>`to_jsonb(${eb.ref("d.cons")})`.as("cons"),

		jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("d.galleryId")).limit(1))
			.$notNull()
			.as("gallery"),
	]);
});
