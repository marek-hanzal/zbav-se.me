import { Effect } from "effect";
import { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";

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

	return listingSourceSelect.select((eb) => [
		"l.id",
		"l.galleryId",
		"l.withImageUrl",
		"l.createdAt",
		// sql<RestrictionEnumSchema.Type[]>`to_jsonb(array(
		// 	select restriction_item.restriction
		// 	from unnest(array[
		// 		${eb.ref("cat.restriction")},
		// 		${eb.ref("l.restriction")}
		// 	]::restriction_enum[]) with ordinality as restriction_item(restriction, ord)
		// 	where restriction_item.restriction is not null
		// 	group by restriction_item.restriction
		// 	order by min(restriction_item.ord)
		// ))`.as("restrictions"),
	]);
});
