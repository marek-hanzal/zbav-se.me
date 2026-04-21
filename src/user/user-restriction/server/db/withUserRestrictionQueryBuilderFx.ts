import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { UserRestrictionFilterSchema } from "../schema/UserRestrictionFilterSchema";
import type { withUserRestrictionSourceSelectFx } from "./withUserRestrictionSourceSelectFx";

export namespace withUserRestrictionQueryBuilderFx {
	export interface Props<
		TSelect extends
			withUserRestrictionSourceSelectFx.Select = withUserRestrictionSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: UserRestrictionFilterSchema.Type;
	}

	export type Callback = <TSelect extends withUserRestrictionSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withUserRestrictionQueryBuilderFx = Effect.fn("withUserRestrictionQueryBuilderFx")(
	function* <TSelect extends withUserRestrictionSourceSelectFx.Select>({
		select,
		where,
	}: withUserRestrictionQueryBuilderFx.Props<TSelect>) {
		const dateContext = yield* DateContextFx;

		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("ur.id", "=", where.id) as TSelect;
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ur.id", "in", where.idIn) as TSelect;
		}

		if (where.userId) {
			query = query.where("ur.userId", "=", where.userId) as TSelect;
		}

		if (where.restriction) {
			query = query.where(
				sql<boolean>`${where.restriction as CategoryRestrictionEnumSchema.Type} = ANY(${sql.ref("ur.restriction")})`,
			) as TSelect;
		}

		if (where.isAvailable === true) {
			query = query.where("ur.availableAt", "<=", dateContext.now().toJSDate()) as TSelect;
		}

		if (where.isAvailable === false) {
			query = query.where("ur.availableAt", ">", dateContext.now().toJSDate()) as TSelect;
		}

		if (where.availableAtGte) {
			query = query.where("ur.availableAt", ">=", where.availableAtGte) as TSelect;
		}

		if (where.availableAtLte) {
			query = query.where("ur.availableAt", "<=", where.availableAtLte) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
