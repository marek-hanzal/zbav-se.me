import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AssistantChatSortSchema } from "~/user/assistant-chat/server/schema/AssistantChatSortSchema";

export namespace withAssistantChatSourceSelectFx {
	export interface Props {
		sort?: AssistantChatSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAssistantChatSourceSelectFx>>;
}

export const withAssistantChatSourceSelectFx = Effect.fn("withAssistantChatSourceSelectFx")(
	function* ({ sort }: withAssistantChatSourceSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("assistant_chat as a");

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("sort", () => query.orderBy("a.sort", item.order))
				.exhaustive();
		}

		return query;
	},
);
