import type { AssistantMessageItem, UserMessageItem } from "@openai/agents-core";

export type MessageContentValue = UserMessageItem["content"] | AssistantMessageItem["content"];
export type UserContentPart = Exclude<UserMessageItem["content"], string>[number];
export type AssistantContentPart = AssistantMessageItem["content"][number];
export type MessageContentPartValue = UserContentPart | AssistantContentPart;

export function getMessageContentParts(content: MessageContentValue): MessageContentPartValue[] {
	if (typeof content === "string") {
		return [
			{
				type: "input_text",
				text: content,
			},
		];
	}

	return content;
}
