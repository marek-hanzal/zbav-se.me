import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatTextDelta } from "./AssistantChatTextDelta";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";

export namespace replaceAssistantChatReasoning {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		delta: AssistantChatTextDelta;
	}
}

export const replaceAssistantChatReasoning = ({
	message,
	delta,
}: replaceAssistantChatReasoning.Props): AssistantChatMessageSchema.Type => {
	return upsertAssistantChatPart({
		message,
		part: {
			id: delta.partId,
			type: "reasoning" satisfies AssistantChatPartTypeEnumSchema.Type,
			text: delta.text,
		},
	});
};
