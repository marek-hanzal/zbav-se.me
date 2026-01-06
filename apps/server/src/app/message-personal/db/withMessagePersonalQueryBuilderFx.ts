import { Effect } from "effect";
import type { MessagePersonalFilterSchema } from "~/app/message-personal/schema/MessagePersonalFilterSchema";
import type { withMessagePersonalSelectFx} from "./withMessagePersonalSelectFx;

export namespace withMessagePersonalQueryBuilderFx {
	export interface Props<TSelect extends withMessagePersonalSelectFxSelect> {
		select: TSelect;
		where?: MessagePersonalFilterSchema.Type;
	}

	export type Callback<TSelect extends withMessagePersonalSelectFxSelect> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from MessagePersonalQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withMessagePersonalQueryBuilderFx = Effect.fn("withMessagePersonalQueryBuilderFx")(function* <
	TSelect extends withMessagePersonalSelectFxSelect,
>({ select, where }: withMessagePersonalQueryBuilderFx.Props<TSelect>) {
	let query = select;

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
});
