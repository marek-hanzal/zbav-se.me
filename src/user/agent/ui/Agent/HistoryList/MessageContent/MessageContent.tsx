import type { AssistantMessageItem, UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { MessageContentPart } from "./MessageContentPart";

export namespace MessageContent {
	export type Content = UserMessageItem["content"] | AssistantMessageItem["content"];
	export type Part =
		| Exclude<UserMessageItem["content"], string>[number]
		| AssistantMessageItem["content"][number];

	export interface Props extends Omit<Partial<MessageContentPart.Props>, "content"> {
		content: Content;
	}
}

export const MessageContent: FC<MessageContent.Props> = ({ content, ...props }) => {
	const parts = getMessageContentParts(content);

	if (!parts.length) {
		return null;
	}

	const countByFingerprint = new Map<string, number>();

	return (
		<>
			{parts.map((part) => (
				<MessageContentPart
					key={getPartKey(part, countByFingerprint)}
					part={part}
					{...props}
				/>
			))}
		</>
	);
};

// =================================================================================================

function getPartKey(part: MessageContent.Part, countByFingerprint: Map<string, number>) {
	const fingerprint = JSON.stringify(part);
	const count = countByFingerprint.get(fingerprint) ?? 0;

	countByFingerprint.set(fingerprint, count + 1);

	return `${fingerprint}-${count}`;
}

function getMessageContentParts(content: MessageContent.Content): MessageContent.Part[] {
	if (typeof content === "string") {
		return [
			{
				type: "input_text",
				text: content,
			} as const,
		];
	}

	return content;
}
