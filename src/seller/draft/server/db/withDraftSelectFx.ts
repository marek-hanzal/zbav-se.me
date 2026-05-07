import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withLikeEx } from "~/server/database/expression/withLikeEx";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";
import type { DraftSortSchema } from "../schema/DraftSortSchema";
import type { DraftWhereSchema } from "../schema/DraftWhereSchema";

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

	return selectFx({
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
			(eb) => {
				return sql<CategorySchema.Type>`
                    to_jsonb(${eb.table("cat")}.*)
                    || jsonb_build_object(
                        'isRestricted',
                        ${eb.ref("cat.restriction")} > ${restrictionSql}
                    )
                `.as("category");
			},
			(eb) => {
				return sql<string[]>`to_jsonb(${eb.ref("d.pros")})`.as("pros");
			},
			(eb) => {
				return sql<string[]>`to_jsonb(${eb.ref("d.cons")})`.as("cons");
			},
			(eb) => {
				return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${eb.ref("d.delivery")})`.as(
					"delivery",
				);
			},
			(eb) => {
				return eb.fn
					.coalesce(
						sql<RestrictionEnumSchema.Type | null>`
                            greatest(
                                ${eb.ref("cat.restriction")},
                                ${eb.ref("d.restriction")}
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
							withLikeEx(eb.ref("d.title"), fulltext, "both"),
							eb("d.categoryId", "in", categoryIdSelect),
						]);
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
