import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withContainsExFn } from "~/database/fn/withContainsExFn";
import { selectFn } from "~/database-query/fn/selectFn";
import type { CategorySortSchema } from "~/user-category/schema/CategorySortSchema";
import type { CategoryWhereSchema } from "~/user-category/schema/CategoryWhereSchema";
import { withUserRestrictionActiveSelectFx } from "~/user-restriction/db/withUserRestrictionActiveSelectFx";

export namespace withCategorySelectFx {
	export interface Props {
		userId: string;
		sort?: CategorySortSchema.Type[];
	}
}

export const withCategorySelectFx = Effect.fn("withCategorySelectFx")(function* ({
	userId,
	sort,
}: withCategorySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	let select = kysely
		.selectFrom("category as cat")
		.selectAll("cat")
		.select((ebFn) => {
			return ebFn("cat.restriction", ">", restrictionSql)
				.$castTo<boolean>()
				.as("isRestricted");
		});

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("group", () => select.orderBy("cat.group", item.order))
			.with("category", () => select.orderBy("cat.category", item.order))
			.with("sort", () => select.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return selectFn({
		select,
		queryFx(select, where: CategoryWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("cat.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("cat.id", "in", where.idIn);
				}

				if (where.fulltext?.length) {
					const fulltext = where.fulltext;

					query = query.where((ebFn) => {
						return ebFn.and(
							fulltext.map((term) =>
								ebFn.or([
									withContainsExFn(ebFn.ref("cat.group"), term),
									withContainsExFn(ebFn.ref("cat.category"), term),
									ebFn.exists(
										ebFn
											.selectFrom("category_spotlight")
											.select("category_spotlight.categoryId")
											.whereRef(
												"category_spotlight.categoryId",
												"=",
												"cat.id",
											)
											.where((ebFn) => {
												return withContainsExFn(
													ebFn.ref("category_spotlight.text"),
													term,
												);
											}),
									),
								]),
							),
						);
					});
				}

				if (where.group) {
					query = query.where((ebFn) => {
						return withContainsExFn(ebFn.ref("cat.group"), where.group);
					});
				}

				if (where.category) {
					query = query.where((ebFn) => {
						return withContainsExFn(ebFn.ref("cat.category"), where.category);
					});
				}

				if (where.locale) {
					query = query.where("cat.locale", "=", where.locale);
				}

				if (where.localeIn?.length) {
					query = query.where("cat.locale", "in", where.localeIn);
				}

				if (where.slug) {
					query = query.where("cat.slug", "=", where.slug);
				}

				if (where?.withRestriction === true) {
					query = query.where((ebFn) => {
						return ebFn("cat.restriction", "<=", restrictionSql);
					});
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
