import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatTextPartSchema } from "~/user/assistant/schema/part/AssistantChatTextPartSchema";
import type { AssistantChatTextDelta } from "./AssistantChatTextDelta";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";

export namespace appendAssistantChatTextDelta {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		delta: AssistantChatTextDelta;
	}
}

export const appendAssistantChatTextDelta = ({
	message,
	delta,
}: appendAssistantChatTextDelta.Props): AssistantChatMessageSchema.Type => {
	const current = message.parts.find((part) => {
		return part.id === delta.partId && part.type === "text";
	});
	const nextPart: AssistantChatTextPartSchema.Type = {
		id: delta.partId,
		type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
		text: current && current.type === "text" ? `${current.text}${delta.text}` : delta.text,
	};

	return upsertAssistantChatPart({
		message,
		part: nextPart,
	});
};
