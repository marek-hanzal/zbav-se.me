import { Effect } from "effect";
import { withAssistantChatSourceSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSourceSelectFx";

export namespace withAssistantChatSelectFx {
	export interface Props extends withAssistantChatSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAssistantChatSelectFx>>;
}

export const withAssistantChatSelectFx = Effect.fn("withAssistantChatSelectFx")(function* ({
	sort,
}: withAssistantChatSelectFx.Props) {
	const sourceSelect = yield* withAssistantChatSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"a.id",
		"a.userId",
		"a.payload",
		"a.createdAt",
		"a.sort",
	]);
});
