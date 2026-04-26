import { Effect } from "effect";
import { sql } from "kysely";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";

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

	return listingSourceSelect
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.select((eb) => [
			"l.id",
			"l.title",
			"l.price",
			"l.priceType",
			"l.currency",
			"l.galleryId",
			"l.withImageUrl",
			"l.createdAt",
			sql<RestrictionEnumSchema.Type[]>`to_jsonb(array(
				select restriction_item.restriction
				from unnest(array[
					${eb.ref("cat.restriction")},
					${eb.ref("l.restriction")}
				]::restriction_enum[]) with ordinality as restriction_item(restriction, ord)
				where restriction_item.restriction is not null
				group by restriction_item.restriction
				order by min(restriction_item.ord)
			))`.as("restrictions"),
			sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			sql<CategoryTableSchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
		]);
});
