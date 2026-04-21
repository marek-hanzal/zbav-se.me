import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { CategorySortSchema } from "~/user/category/server/schema/CategorySortSchema";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withCategorySourceSelectFx {
	export interface Props {
		sort?: CategorySortSchema.Type[];
		userId?: string;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategorySourceSelectFx>>;
}

export const withCategorySourceSelectFx = Effect.fn("withCategorySourceSelectFx")(function* ({
	sort,
	userId,
}: withCategorySourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const fallbackSql = sql`${CategoryRestrictionEnumSchema.enum.none}::category_restriction_enum`;
	const restrictionSql = userId
		? sql`coalesce((${yield* withActiveUserRestrictionSelectFx({
				userId,
			})}), ${fallbackSql})`
		: fallbackSql;

	let query = kysely.selectFrom("category as cat").where((eb) => {
		return sql<boolean>`${eb.ref("cat.restriction")} <= ${restrictionSql}`;
	});

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.order))
			.with("category", () => query.orderBy("cat.category", item.order))
			.with("sort", () => query.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return query;
});
