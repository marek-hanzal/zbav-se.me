import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ListingMetaSchema } from "../schema/ListingMetaSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

const publicCategoryRestrictions = [
	RestrictionEnumSchema.enum.none,
	RestrictionEnumSchema.enum["adult-relaxed"],
] as const;

export namespace withListingSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta?: ListingMetaSchema.Type;
		hasExplicitCategory: boolean;
	}
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		])
		.where((eb) => {
			return eb("cat.restriction", "in", publicCategoryRestrictions);
		})
		.where((eb) => {
			return eb.or([
				eb("l.restriction", "is", null),
				eb("l.restriction", "in", publicCategoryRestrictions),
			]);
		});

	if (!hasExplicitCategory) {
		select = select.where("cat.discovery", "=", "implicit");
	}

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => select.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => select.orderBy("l.expiresAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: select.select([
			"l.id",
			"l.galleryId",
			"l.withImageUrl",
			"l.createdAt",
			(eb) => {
				return sql<string[]>`to_jsonb(${eb.ref("l.pros")})`.as("pros");
			},
			(eb) => {
				return sql<string[]>`to_jsonb(${eb.ref("l.cons")})`.as("cons");
			},
			(eb) => {
				return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${eb.ref("l.delivery")})`.as(
					"delivery",
				);
			},
			(eb) => {
				return eb.fn
					.coalesce(
						sql<RestrictionEnumSchema.Type | null>`
                            greatest(
                                ${eb.ref("cat.restriction")},
                                ${eb.ref("l.restriction")}
                            )
			            `,
						sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`,
					)
					.$castTo<RestrictionEnumSchema.Type>()
					.as("withRestriction");
			},
		]),
		queryFx(select, where: ListingWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(query);
				}

				if (where.id) {
					query = query.where("l.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("l.id", "in", where.idIn);
				}

				if (where.fulltext) {
					const _fulltext = where.fulltext;

					// query = query.where((eb) => {
					// 	const categoryIdSelect = eb
					// 		.selectFrom("category as cat")
					// 		.select("cat.id")
					// 		.where((eb) =>
					// 			eb.or([
					// 				withLikeEx(eb.ref("cat.category"), fulltext),
					// 				withLikeEx(eb.ref("cat.group"), fulltext),
					// 			]),
					// 		);

					// 	return eb.or([
					// 		withNormalizedLikeEx(eb.ref("l.withTitleSearch"), fulltext, "both"),
					// 		eb("l.categoryId", "in", categoryIdSelect),
					// 	]);
					// }) as TSelect;
				}

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
