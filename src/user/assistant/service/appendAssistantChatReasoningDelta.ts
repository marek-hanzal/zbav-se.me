import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatReasoningPartSchema } from "~/user/assistant/schema/part/AssistantChatReasoningPartSchema";
import type { AssistantChatTextDelta } from "./AssistantChatTextDelta";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";

export namespace appendAssistantChatReasoningDelta {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		delta: AssistantChatTextDelta;
	}
}

export const appendAssistantChatReasoningDelta = ({
	message,
	delta,
}: appendAssistantChatReasoningDelta.Props): AssistantChatMessageSchema.Type => {
	const current = message.parts.find((part) => {
		return part.id === delta.partId && part.type === "reasoning";
	});
	const nextPart: AssistantChatReasoningPartSchema.Type = {
		id: delta.partId,
		type: "reasoning" satisfies AssistantChatPartTypeEnumSchema.Type,
		text: current && current.type === "reasoning" ? `${current.text}${delta.text}` : delta.text,
	};

	return upsertAssistantChatPart({
		message,
		part: nextPart,
	});
};
