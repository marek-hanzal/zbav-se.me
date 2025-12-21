import { sql } from "kysely";
import type { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import type { withListingCollectionSelect } from "~/app/listing/db/withListingCollectionSelect";
import type { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";
import { withLikeEx } from "~/database/expression/withLikeEx";

export namespace withListingQueryBuilder {
	export interface Props<TSelect extends withListingCollectionSelect.Select> {
		userId: string;
		select: TSelect;
		where?: ListingFilterSchema.Type;
		meta?: ListingMetaSchema.Type;
	}

	export type Callback<TSelect extends withListingCollectionSelect.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from ListingQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingQueryBuilder = <TSelect extends withListingCollectionSelect.Select>({
	userId,
	select,
	where,
	meta,
}: withListingQueryBuilder.Props<TSelect>) => {
	if (!where) {
		return select;
	}
	let query = select;

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

	if (where.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId) as TSelect;
	}

	if (where.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn) as TSelect;
	}

	if (meta?.latLon && where.range !== undefined) {
		const { lon, lat } = meta.latLon;

		query = query.where(
			(eb) =>
				sql`ST_DWithin(
					${eb.ref("loc.geo")},
					ST_SetSRID(ST_MakePoint(${eb.val(lon)}, ${eb.val(lat)}), 4326)::geography,
					${eb.val(where.range)}
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

	if (where.feedId) {
		const feedId = where.feedId;
		query = query.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("favourite as f")
					.select("f.listingId")
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId)
					.where("f.feedId", "=", feedId),
			),
		) as TSelect;
	}

	if (where.feedIdIn && where.feedIdIn.length > 0) {
		const feedIdIn = where.feedIdIn;
		query = query.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("favourite as f")
					.select("f.listingId")
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId)
					.where("f.feedId", "in", feedIdIn),
			),
		) as TSelect;
	}

	return query;
};
