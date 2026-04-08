/** biome-ignore-all lint/suspicious/noArrayIndexKey: Ssst */
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { ReasoningPart } from "./part/ReasoningPart";
import { TextPart } from "./part/TextPart";
import { ToolCallPart } from "./part/ToolCallPart";

export namespace Message {
	export interface Props extends Container.Props {
		message: AssistantChatMessageSchema.Type;
	}
}

export const Message: FC<Message.Props> = ({ message, ...props }) => {
	return (
		<Container {...props}>
			{message.parts.map((part, i) => {
				return match(part)
					.with(
						{
							type: "text",
						},
						(part) => {
							return (
								<TextPart
									key={`${message.id}-part-${i}`}
									message={message}
									part={part}
								/>
							);
						},
					)
					.with(
						{
							type: "reasoning",
						},
						(part) => {
							return (
								<ReasoningPart
									key={`${message.id}-part-${i}`}
									message={message}
									part={part}
								/>
							);
						},
					)
					.with(
						{
							type: "tool_call",
						},
						(part) => {
							return (
								<ToolCallPart
									key={`${message.id}-part-${i}`}
									part={part}
								/>
							);
						},
					)
					.exhaustive();
			})}
		</Container>
	);
};
