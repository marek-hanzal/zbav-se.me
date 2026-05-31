import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withContainsEx } from "~/server/database/expression/withContainsEx";
import type { CategorySortSchema } from "../schema/CategorySortSchema";
import type { CategoryWhereSchema } from "../schema/CategoryWhereSchema";

export namespace withCategorySelectFx {
	export interface Props {
		sort?: CategorySortSchema.Type[];
	}
}

export const withCategorySelectFx = Effect.fn("withCategorySelectFx")(function* ({
	sort,
}: withCategorySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely
		.selectFrom("category as cat")
		.selectAll("cat")
		.where("cat.restriction", "=", "none");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("group", () => select.orderBy("cat.group", item.order))
			.with("category", () => select.orderBy("cat.category", item.order))
			.with("sort", () => select.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return selectFx({
		select,
		queryFx(select, where: CategoryWhereSchema.Type) {
			return Effect.gen(function* () {
				let query: typeof select = select;

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

					query = query.where((eb) => {
						return eb.and(
							fulltext.map((term) =>
								eb.or([
									withContainsEx(eb.ref("cat.group"), term),
									withContainsEx(eb.ref("cat.category"), term),
									eb.exists(
										eb
											.selectFrom("category_spotlight")
											.select("category_spotlight.categoryId")
											.whereRef(
												"category_spotlight.categoryId",
												"=",
												"cat.id",
											)
											.where((eb) => {
												return withContainsEx(
													eb.ref("category_spotlight.text"),
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
					query = query.where((eb) => {
						return withContainsEx(eb.ref("cat.group"), where.group);
					});
				}

				if (where.category) {
					query = query.where((eb) => {
						return withContainsEx(eb.ref("cat.category"), where.category);
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

				return yield* Effect.succeed(query);
			});
		},
	});
});
