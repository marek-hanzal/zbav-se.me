import { Effect } from "effect";
import type { withAssistantChatSourceSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSourceSelectFx";
import type { AssistantChatWhereSchema } from "~/user/assistant-chat/server/schema/AssistantChatWhereSchema";

export namespace withAssistantChatQueryBuilderFx {
	export interface Props<
		TSelect extends
			withAssistantChatSourceSelectFx.Select = withAssistantChatSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: AssistantChatWhereSchema.Type;
	}

	export type Callback = <TSelect extends withAssistantChatSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withAssistantChatQueryBuilderFx = Effect.fn("withAssistantChatQueryBuilderFx")(
	function* <TSelect extends withAssistantChatSourceSelectFx.Select>({
		select,
		where,
	}: withAssistantChatQueryBuilderFx.Props<TSelect>) {
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
	},
);
