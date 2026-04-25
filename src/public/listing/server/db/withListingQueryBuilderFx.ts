import { Effect } from "effect";
import { sql } from "kysely";
import type { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import { withLikeEx } from "~/server/database/expression/withLikeEx";

export namespace withListingQueryBuilderFx {
	export interface Props<TSelect extends withListingSourceSelectFx.Select> {
		select: TSelect;
		where?: ListingFilterSchema.Type;
		meta?: ListingMetaSchema.Type;
	}

	export type Callback<TSelect extends withListingSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

export const withListingQueryBuilderFx = Effect.fn("withListingQueryBuilderFx")(function* <
	TSelect extends withListingSourceSelectFx.Select,
>({ select, where, meta }: withListingQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(query);
	}

	if (where.id) {
		query = query.where("l.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn) as TSelect;
	}

	if (where.fulltext) {
		const fulltext = where.fulltext;

		query = query.where((eb) =>
			eb.or([
				withLikeEx(eb.ref("l.title"), fulltext, "both"),
				withLikeEx(eb.ref("cat.category"), fulltext),
				withLikeEx(eb.ref("cat.group"), fulltext),
			]),
		) as TSelect;
	}

	if (where.priceMin !== undefined) {
		query = query.where("l.price", ">=", where.priceMin) as TSelect;
	}

	if (where.priceMax !== undefined) {
		query = query.where("l.price", "<=", where.priceMax) as TSelect;
	}

	if (where.conditionMin !== undefined) {
		query = query.where("l.condition", ">=", where.conditionMin) as TSelect;
	}

	if (where.conditionMax !== undefined) {
		query = query.where("l.condition", "<=", where.conditionMax) as TSelect;
	}

	if (where.conditionIn && where.conditionIn.length > 0) {
		query = query.where("l.condition", "in", where.conditionIn) as TSelect;
	}

	if (where.ageMin !== undefined) {
		query = query.where("l.age", ">=", where.ageMin) as TSelect;
	}

	if (where.ageMax !== undefined) {
		query = query.where("l.age", "<=", where.ageMax) as TSelect;
	}

	if (where.ageIn && where.ageIn.length > 0) {
		query = query.where("l.age", "in", where.ageIn) as TSelect;
	}

	if (where.deliveryIn && where.deliveryIn.length > 0) {
		const deliveryIn = where.deliveryIn;

		query = query.where(
			(eb) => sql`${eb.ref("l.delivery")} && ${sql.val(deliveryIn)}::listing_delivery_enum[]`,
		) as TSelect;
	}

	if (where.warrantyIn && where.warrantyIn.length > 0) {
		query = query.where("l.warranty", "in", where.warrantyIn) as TSelect;
	}

	if (where.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId) as TSelect;
	}

	if (where.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn) as TSelect;
	}

	if (meta?.locationId && where.range !== undefined) {
		const locationId = meta.locationId;
		const range = where.range * 1_000;

		query = query.where(
			(eb) => {
				const originGeoSelect = eb
					.selectFrom("location as originLoc")
					.select("originLoc.geo")
					.where("originLoc.id", "=", locationId)
					.limit(1);

				return sql`ST_DWithin(
					${eb.ref("loc.geo")},
					${originGeoSelect},
					${eb.val(range)}
				)`;
			},
		) as TSelect;
	}

	if (where.title) {
		query = query.where((eb) => withLikeEx(eb.ref("l.title"), where.title, "both")) as TSelect;
	}

	return yield* Effect.succeed(query);
});
