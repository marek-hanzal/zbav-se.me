import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { CategoryDbSchema } from "~/@session/category/schema/CategoryDbSchema";
import type { ListingDeliveryEnumSchema } from "~/@session/listing/schema/ListingDeliveryEnumSchema";
import { withDraftSourceSelectFx } from "~/@user/draft/db/withDraftSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";

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
		sql<LocationDbSchema.Type | null>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategoryDbSchema.Type | null>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
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
