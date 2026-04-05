import { Effect } from "effect";
import type { withAssistantSourceSelectFx } from "~/user/assistant/server/db/withAssistantSourceSelectFx";
import type { AssistantWhereSchema } from "~/user/assistant/server/schema/AssistantWhereSchema";

export namespace withAssistantQueryBuilderFx {
	export interface Props<
		TSelect extends withAssistantSourceSelectFx.Select = withAssistantSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: AssistantWhereSchema.Type;
	}

	export type Callback = <TSelect extends withAssistantSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withAssistantQueryBuilderFx = Effect.fn("withAssistantQueryBuilderFx")(function* <
	TSelect extends withAssistantSourceSelectFx.Select,
>({ select, where }: withAssistantQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("a.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("a.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("a.userId", "=", where.userId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
