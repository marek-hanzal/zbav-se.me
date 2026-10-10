import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withContainsExFn } from "~/database/fn/withContainsExFn";
import { selectFn } from "~/database-query/fn/selectFn";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import type { DraftSortSchema } from "~/seller-draft/schema/DraftSortSchema";
import type { DraftWhereSchema } from "~/seller-draft/schema/DraftWhereSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import type { CategorySchema } from "~/user-category/schema/CategorySchema";
import { withUserRestrictionActiveSelectFx } from "~/user-restriction/db/withUserRestrictionActiveSelectFx";

export namespace withDraftSelectFx {
	export interface Props {
		userId: string;
		sort?: DraftSortSchema.Type[];
	}
}

export const withDraftSelectFx = Effect.fn("withDraftSelectFx")(function* ({
	userId,
	sort,
}: withDraftSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("draft as d")
		.leftJoin("category as cat", "cat.id", "d.categoryId");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("d.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("d.updatedAt", item.order))
			.exhaustive();
	}

	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	return selectFn({
		select: query.select([
			"d.id",
			//
			"d.withUploadIds",
			"d.withImageUrl",
			//
			"d.title",
			"d.description",
			//
			"d.locationId",
			//
			"d.categoryId",
			"d.restriction",
			//
			"d.price",
			"d.currency",
			"d.priceType",
			//
			"d.expires",
			//
			"d.galleryId",
			"d.warranty",
			//
			"d.age",
			"d.condition",
			//
			"d.createdAt",
			"d.updatedAt",
			//
			(ebFn) => {
				return ebFn
					.selectFrom("location as loc")
					.select((ebFn) => {
						return sql<LocationSchema.Type>`to_jsonb(${ebFn.table("loc")}.*)`.as(
							"json",
						);
					})
					.whereRef("loc.id", "=", "d.locationId")
					.limit(1)
					.$asScalar()
					.$castTo<LocationSchema.Type | null>()
					.as("location");
			},
			//
			(ebFn) => {
				return sql<CategorySchema.Type>`
                    to_jsonb(${ebFn.table("cat")}.*)
                    || jsonb_build_object(
                        'isRestricted',
                        ${ebFn.ref("cat.restriction")} > ${restrictionSql}
                    )
                `.as("category");
			},
			(ebFn) => {
				return sql<string[]>`to_jsonb(${ebFn.ref("d.pros")})`.as("pros");
			},
			(ebFn) => {
				return sql<string[]>`to_jsonb(${ebFn.ref("d.cons")})`.as("cons");
			},
			(ebFn) => {
				return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${ebFn.ref("d.delivery")})`.as(
					"delivery",
				);
			},
			(ebFn) => {
				return ebFn.fn
					.coalesce(
						sql<RestrictionEnumSchema.Type | null>`
                            greatest(
                                ${ebFn.ref("cat.restriction")},
                                ${ebFn.ref("d.restriction")}
                            )
			            `,
						sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`,
					)
					.$castTo<RestrictionEnumSchema.Type>()
					.as("withRestriction");
			},
		]),
		queryFx(select, where: DraftWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("d.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("d.id", "in", where.idIn);
				}

				if (where.fulltext?.length) {
					const fulltext = where.fulltext;

					query = query.where((ebFn) => {
						return ebFn.and(
							fulltext.map((term) => {
								const categoryIdSelect = ebFn
									.selectFrom("category as cat")
									.select("cat.id")
									.where((ebFn) =>
										ebFn.or([
											withContainsExFn(ebFn.ref("cat.category"), term),
											withContainsExFn(ebFn.ref("cat.group"), term),
										]),
									);

								return ebFn.or([
									withContainsExFn(ebFn.ref("d.title"), term),
									ebFn("d.categoryId", "in", categoryIdSelect),
								]);
							}),
						);
					});
				}

				if (where.userId) {
					query = query.where("d.userId", "=", where.userId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
