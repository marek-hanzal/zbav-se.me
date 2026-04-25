import { Effect } from "effect";
import { sql } from "kysely";
import type { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
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
	const { kysely } = yield* KyselyContextFx;
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

		query = query.where((eb) => {
			const categoryIdSelect = eb
				.selectFrom("category as cat")
				.select("cat.id")
				.where((eb) =>
					eb.or([
						withLikeEx(eb.ref("cat.category"), fulltext),
						withLikeEx(eb.ref("cat.group"), fulltext),
					]),
				);

			return eb.or([
				withLikeEx(eb.ref("l.title"), fulltext, "both"),
				eb("l.categoryId", "in", categoryIdSelect),
			]);
		}) as TSelect;
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

		query = query.where((eb) => {
			const originGeoSelect = eb
				.selectFrom("location as originLoc")
				.select("originLoc.geo")
				.where("originLoc.id", "=", locationId)
				.limit(1);

			return sql`ST_DWithin(
					${eb.ref("l.withLocationGeo")},
					${originGeoSelect},
					${eb.val(range)}
				)`;
		}) as TSelect;
	}

	if (where.title) {
		/**
		 * Public title search needs a special execution path on large datasets.
		 *
		 * Why this exists:
		 * - The naive predicate `withLikeEx(l.title, ...)` is semantically correct, but on a
		 *   multi-hundred-thousand / million-row listing table PostgreSQL may decide to walk
		 *   `listing_[live-createdAt]_idx` first and apply the title predicate as a late filter.
		 * - That plan is acceptable for broad / common title terms, but it can become
		 *   catastrophically bad for selective multi-token searches that return very few rows.
		 *   In those cases the planner keeps scanning rows in sort order, repeatedly evaluating
		 *   the expensive normalized `LIKE` expression until it proves there is no match or
		 *   finds enough rows. We measured worst cases in seconds on ~1M listings.
		 *
		 * What this branch does:
		 * - For "selective enough" title searches we build a separate subquery over `listing lt`
		 *   that finds candidate ids by title first.
		 * - That subquery is intentionally fenced using `offset(0)`. In PostgreSQL this acts as
		 *   a cheap anti-inlining barrier that prevents the planner from flattening the title
		 *   match back into the outer query and reintroducing the bad plan shape.
		 * - Once candidate ids are produced, we join them back to the outer listing query using
		 *   `tm.id = l.id`, allowing the trigram title index to do the heavy lifting first.
		 *
		 * Why the path is conditional:
		 * - Very short tokens (`a`, `k`, `tv`, etc.) are usually low-selectivity noise.
		 * - For those terms the "candidate ids first" strategy can explode the intermediate
		 *   result set and become worse than the original direct predicate.
		 * - Therefore we only enable the selective path when every token has length >= 3.
		 *   Otherwise we deliberately fall back to the simpler direct predicate.
		 *
		 * Why explicit category filters matter:
		 * - The public source select applies `withCategoryDiscovery = implicit` only when the
		 *   caller does not request an explicit category filter.
		 * - The title candidate subquery must mirror that exact semantic contract. If we forced
		 *   `implicit` unconditionally here, explicit-category public searches would silently
		 *   drop valid rows from categories that are intentionally visible only through explicit
		 *   filtering.
		 *
		 * Important constraints:
		 * - This is a performance optimization only. It must not change returned rows.
		 * - Keep this logic aligned with the surrounding public visibility rules.
		 * - If title matching semantics change in `withLikeEx`, this branch should be reviewed
		 *   together with the related EXPLAIN plans.
		 */
		const titleTokens = where.title
			.split(/\s+/g)
			.map((token) => token.trim())
			.filter(Boolean);
		const hasExplicitCategoryFilter = Boolean(
			where.categoryId || (where.categoryIdIn && where.categoryIdIn.length > 0),
		);
		const withSelectiveTitlePath =
			titleTokens.length > 0 && titleTokens.every((token) => token.length >= 3);

		if (withSelectiveTitlePath) {
			const titleMatchSelectBase = kysely
				.selectFrom("listing as lt")
				.select([
					"lt.id as id",
					"lt.createdAt as createdAt",
				])
				.where("lt.status", "=", "live");
			const titleMatchSelect = (
				hasExplicitCategoryFilter
					? titleMatchSelectBase
					: titleMatchSelectBase.where("lt.withCategoryDiscovery", "=", "implicit")
			)
				.where((eb) => withLikeEx(eb.ref("lt.title"), where.title, "both"))
				.offset(0)
				.as("tm");

			query = query.innerJoin(titleMatchSelect, (join) =>
				join.onRef("tm.id", "=", "l.id"),
			) as TSelect;
		} else {
			query = query.where((eb) =>
				withLikeEx(eb.ref("l.title"), where.title, "both"),
			) as TSelect;
		}
	}

	return yield* Effect.succeed(query);
});
