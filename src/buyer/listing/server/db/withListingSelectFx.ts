import { Effect } from "effect";
import { sql } from "kysely";
import { withListingSourceSelectFx } from "~/buyer/listing/server/db/withListingSourceSelectFx";
import type { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withListingSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {
		//
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	userId,
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const locationId = meta?.locationId;
	const listingSourceSelect = yield* withListingSourceSelectFx({
		userId,
		sort,
		meta,
		hasExplicitCategory,
	});

	const restrictionSql = yield* withActiveUserRestrictionSelectFx({
		userId,
	});

	return listingSourceSelect.selectAll("l").select((eb) => [
		// sql<RestrictionEnumSchema.Type[]>`to_jsonb(array(
		// 		select restriction_item.restriction
		// 		from unnest(array[
		// 			${eb.ref("cat.restriction")},
		// 			${eb.ref("l.restriction")}
		// 		]::restriction_enum[]) with ordinality as restriction_item(restriction, ord)
		// 		where restriction_item.restriction is not null
		// 		group by restriction_item.restriction
		// 		order by min(restriction_item.ord)
		// 	))`.as("restrictions"),
		/**
		 * Build the nested category payload from the DB row and append the computed
		 * restriction flag. In Postgres, `jsonb || jsonb` merges both objects.
		 */
		// sql<CategorySchema.Type>`
		// 		to_jsonb(${eb.table("cat")}.*)
		// 		|| jsonb_build_object(
		// 			'isRestricted',
		// 			${eb.ref("cat.restriction")} > ${restrictionSql}
		// 		)
		// 	`.as("category"),
		// sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("l.delivery")})`.as(
		// 	"delivery",
		// ),
		// sql<string[] | null>`to_jsonb(${eb.ref("l.pros")})`.as("pros"),
		// sql<string[] | null>`to_jsonb(${eb.ref("l.cons")})`.as("cons"),
		// eb
		// 	.case()
		// 	.when(sql.lit(locationId != null))
		// 	.then(() => {
		// 		const originGeoSelect = eb
		// 			.selectFrom("location as originLoc")
		// 			.select("originLoc.geo")
		// 			// biome-ignore lint/style/noNonNullAssertion: Check is already don, bro
		// 			.where("originLoc.id", "=", locationId!)
		// 			.limit(1);

		// 		return sql`
		//                 ST_Distance(
		//                     ${eb.ref("l.withLocationGeo")},
		//                     ${originGeoSelect}
		//                 ) / 1000
		//             `;
		// 	})
		// 	.else(null)
		// 	.end()
		// 	.$castTo<number | null>()
		// 	.as("distance"),
		sql<boolean>`${eb.ref("l.userId")} = ${eb.val(userId)}`.as("my"),

		eb
			.exists(
				eb
					.selectFrom("favourite as f")
					.select(sql`1`.as("true"))
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("isFavourite"),

		eb
			.exists(
				eb
					.selectFrom("ignore as i")
					.select(sql`1`.as("true"))
					.whereRef("i.listingId", "=", "l.id")
					.where("i.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("isIgnored"),

		eb
			.exists(
				eb
					.selectFrom("flag as f")
					.select(sql`1`.as("true"))
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("hasFlag"),

		eb
			.selectFrom("transaction as lt")
			.select("lt.id")
			.whereRef("lt.listingId", "=", "l.id")
			.where("lt.userId", "=", userId)
			.where("lt.status", "in", [
				"interest",
				"trade",
				"rejected",
				"resolved",
				"success",
			])
			.orderBy("lt.statusUpdatedAt", "desc")
			.orderBy("lt.id", "desc")
			.limit(1)
			.as("transactionId"),

		eb
			.selectFrom("thumb as fb")
			.select("fb.type")
			.whereRef("fb.listingId", "=", "l.id")
			.where("fb.userId", "=", userId)
			.limit(1)
			.$castTo<ThumbEnumSchema.Type | null>()
			.as("thumb"),
	]);
});
