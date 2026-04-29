import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";
import type { ListingFilterSchema } from "../schema/ListingFilterSchema";
import type { ListingMetaSchema } from "../schema/ListingMetaSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";

export namespace withListingSelectFx {
	export interface Props {
		userId: string;
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory: boolean | undefined;
	}
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	userId,
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const fallbackSql = sql`${RestrictionEnumSchema.enum.none}::restriction_enum`;
	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		])
		.where((eb) => {
			return eb(eb.fn.coalesce("cat.restriction", fallbackSql), "<=", restrictionSql);
		})
		.where((eb) => {
			return eb(eb.fn.coalesce("l.restriction", fallbackSql), "<=", restrictionSql);
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
		select: select
			.select([
				"l.id",
				"l.userId",
				"l.status",
				"l.categoryId",
				"l.withImageUrl",
				"l.withUploadIds",
				"l.createdAt",
				"l.updatedAt",
				(eb) => {
					return sql<string[]>`to_jsonb(${eb.ref("l.pros")})`.as("pros");
				},
				(eb) => {
					return sql<string[]>`to_jsonb(${eb.ref("l.cons")})`.as("cons");
				},
			])
			.select((eb) => {
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
			})
			.select((eb) => {
				return eb("l.userId", "=", userId).$castTo<boolean>().as("my");
			})
			.select((eb) => [
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
					// .$castTo<ThumbEnumSchema.Type | null>()
					.as("thumb"),
			]),
		queryFx(select, where: ListingFilterSchema.Type) {
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

					/**
					 * Join also category spotlight for fulltext search
					 */
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
					// }) ;
				}

				if (where.userId) {
					query = query.where("l.userId", "=", where.userId);
				}

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				if (where.withOwn === false) {
					query = query.where("l.userId", "!=", userId);
				}

				if (where.my === true) {
					query = query.where("l.userId", "=", userId);
				}

				if (where.withIgnored === false) {
					query = query.where(({ not, exists, selectFrom }) => {
						return not(
							exists(
								selectFrom("ignore as i")
									.select("i.listingId")
									.whereRef("i.listingId", "=", "l.id")
									.where("i.userId", "=", userId),
							),
						);
					});
				}

				if (where.isFavourite === true) {
					query = query.where(({ exists, selectFrom }) => {
						return exists(
							selectFrom("favourite as f")
								.select("f.listingId")
								.whereRef("f.listingId", "=", "l.id")
								.where("f.userId", "=", userId),
						);
					});
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
