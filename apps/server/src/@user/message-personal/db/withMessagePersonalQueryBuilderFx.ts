import { Effect } from "effect";
import type { withMessagePersonalSelectFx } from "~/@user/message-personal/db/withMessagePersonalSelectFx";
import type { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";

export namespace withMessagePersonalQueryBuilderFx {
	export interface Props<TSelect extends withMessagePersonalSelectFx.Select> {
		select: TSelect;
		where?: MessagePersonalFilterSchema.Type;
	}

	export type Callback<TSelect extends withMessagePersonalSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from MessagePersonalQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withMessagePersonalQueryBuilderFx = Effect.fn("withMessagePersonalQueryBuilderFx")(
	function* <TSelect extends withMessagePersonalSelectFx.Select>({
		select,
		where,
	}: withMessagePersonalQueryBuilderFx.Props<TSelect>) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("mp.id", "=", where.id) as TSelect;
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("mp.id", "in", where.idIn) as TSelect;
		}

		if (where.messageThreadId) {
			query = query.where("mp.messageThreadId", "=", where.messageThreadId) as TSelect;
		}

		if (where.userId) {
			query = query.where("mp.userId", "=", where.userId) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
