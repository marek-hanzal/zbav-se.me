import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatTextDelta } from "./AssistantChatTextDelta";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";

export namespace replaceAssistantChatText {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		delta: AssistantChatTextDelta;
	}
}

export const replaceAssistantChatText = ({
	message,
	delta,
}: replaceAssistantChatText.Props): AssistantChatMessageSchema.Type => {
	return upsertAssistantChatPart({
		message,
		part: {
			id: delta.partId,
			type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
			text: delta.text,
		},
	});
};
