import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withLikeEx } from "~/server/database/expression/withLikeEx";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";
import type { CategoryFilterSchema } from "../schema/CategoryFilterSchema";
import type { CategorySortSchema } from "../schema/CategorySortSchema";

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
		.select((eb) => {
			return eb("cat.restriction", ">", restrictionSql).$castTo<boolean>().as("isRestricted");
		});

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("group", () => select.orderBy("cat.group", item.order))
			.with("category", () => select.orderBy("cat.category", item.order))
			.with("sort", () => select.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return selectFx({
		select,
		queryFx(select, where: CategoryFilterSchema.Type) {
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

				if (where.fulltext) {
					const fulltext = where.fulltext;

					query = query.where((eb) => {
						return eb.or([
							withLikeEx(eb.ref("cat.group"), fulltext),
							withLikeEx(eb.ref("cat.category"), fulltext),
							eb.exists(
								eb
									.selectFrom("category_spotlight")
									.select("category_spotlight.categoryId")
									.whereRef("category_spotlight.categoryId", "=", "cat.id")
									.where((eb) => {
										return withLikeEx(
											eb.ref("category_spotlight.text"),
											fulltext,
										);
									}),
							),
						]);
					});
				}

				if (where.group) {
					query = query.where((eb) => {
						return withLikeEx(eb.ref("cat.group"), where.group);
					});
				}

				if (where.category) {
					query = query.where((eb) => {
						return withLikeEx(eb.ref("cat.category"), where.category);
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
					query = query.where((eb) => {
						return eb("cat.restriction", "<=", restrictionSql);
					});
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
