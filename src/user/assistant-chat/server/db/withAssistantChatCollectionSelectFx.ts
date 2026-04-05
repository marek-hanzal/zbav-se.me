import { Effect } from "effect";
import { withAssistantChatSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSelectFx";
import type { withAssistantChatSourceSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSourceSelectFx";

export namespace withAssistantChatCollectionSelectFx {
	export interface Props extends withAssistantChatSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withAssistantChatCollectionSelectFx>
	>;
}

export const withAssistantChatCollectionSelectFx = Effect.fn("withAssistantChatCollectionSelectFx")(
	function* ({ sort }: withAssistantChatCollectionSelectFx.Props) {
		return yield* withAssistantChatSelectFx({
			sort,
		});
	},
);
