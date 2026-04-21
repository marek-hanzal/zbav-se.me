import { Effect } from "effect";
import { sql } from "kysely";
import type { withListingSourceSelectFx } from "~/buyer/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { withLikeEx } from "~/server/database/expression/withLikeEx";

export namespace withListingQueryBuilderFx {
	export interface Props<TSelect extends withListingSourceSelectFx.Select> {
		userId: string;
		select: TSelect;
		where?: ListingFilterSchema.Type;
		meta?: ListingMetaSchema.Type;
	}

	export type Callback<TSelect extends withListingSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from ListingQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingQueryBuilderFx = Effect.fn("withListingQueryBuilderFx")(function* <
	TSelect extends withListingSourceSelectFx.Select,
>({ userId, select, where, meta }: withListingQueryBuilderFx.Props<TSelect>) {
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

	if (where.userId) {
		query = query.where("l.userId", "=", where.userId) as TSelect;
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

	if (meta?.latLon && where.range !== undefined) {
		const { lon, lat } = meta.latLon;
		const range = where.range * 1_000;

		query = query.where(
			(eb) =>
				sql`ST_DWithin(
					${eb.ref("loc.geo")},
					ST_SetSRID(ST_MakePoint(${eb.val(lon)}, ${eb.val(lat)}), 4326)::geography,
					${eb.val(range)}
				)`,
		) as TSelect;
	}

	if (where.title) {
		query = query.where((eb) => withLikeEx(eb.ref("l.title"), where.title, "both")) as TSelect;
	}

	if (where.withOwn === false) {
		query = query.where("l.userId", "!=", userId) as TSelect;
	}

	if (where.my === true) {
		query = query.where("l.userId", "=", userId) as TSelect;
	}

	if (where.withIgnored !== undefined && where.withIgnored !== true) {
		query = query.where(({ not, exists, selectFrom }) =>
			not(
				exists(
					selectFrom("ignore as i")
						.select("i.listingId")
						.whereRef("i.listingId", "=", "l.id")
						.where("i.userId", "=", userId),
				),
			),
		) as TSelect;
	}

	if (where.isFavourite === true) {
		query = query.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("favourite as f")
					.select("f.listingId")
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			),
		) as TSelect;
	}

	return yield* Effect.succeed(query);
});
