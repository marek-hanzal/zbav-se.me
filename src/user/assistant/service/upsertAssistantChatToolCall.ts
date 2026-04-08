import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatToolCallPatch } from "./AssistantChatToolCallPatch";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";

export namespace upsertAssistantChatToolCall {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		patch: AssistantChatToolCallPatch;
	}
}

export const upsertAssistantChatToolCall = ({
	message,
	patch,
}: upsertAssistantChatToolCall.Props): AssistantChatMessageSchema.Type => {
	const current = message.parts.find((part) => {
		return part.id === patch.id && part.type === "tool_call";
	});

	return upsertAssistantChatPart({
		message,
		part: {
			id: patch.id,
			type: "tool_call" satisfies AssistantChatPartTypeEnumSchema.Type,
			toolName: patch.toolName ?? (current?.type === "tool_call" ? current.toolName : "tool"),
			status:
				patch.status ?? (current?.type === "tool_call" ? current.status : "in_progress"),
			input: patch.input ?? (current?.type === "tool_call" ? current.input : ""),
			output: patch.output ?? (current?.type === "tool_call" ? current.output : ""),
		},
	});
};
