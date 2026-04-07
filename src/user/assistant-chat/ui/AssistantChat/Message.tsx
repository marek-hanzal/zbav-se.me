/** biome-ignore-all lint/suspicious/noArrayIndexKey: Ssst */
import type { UIDataTypes, UIMessage, UITools } from "ai";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { ReasoningPart } from "./part/ReasoningPart";
import { TextPart } from "./part/TextPart";

export namespace Message {
	export interface Props extends Container.Props {
		message: UIMessage<unknown, UIDataTypes, UITools>;
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
							type: "step-start",
						},
						(_part) => {
							return "Step!";
						},
					)
					.with(
						{
							type: "dynamic-tool",
						},
						(part) => {
							return `tool - ${part.toolName}`;
						},
					)
					.with(
						{
							type: "file",
						},
						(part) => {
							return `file - ${part.url}`;
						},
					)
					.with(
						{
							type: "source-url",
						},
						(_part) => {
							return "source-url";
						},
					)
					.with(
						{
							type: "source-document",
						},
						(_part) => {
							return "source-document";
						},
					)
					.with(
						{
							type: "tool-knowledge-index",
						},
						(part) => {
							return "knowledge index";
						},
					)
					.exhaustive();
			})}
		</Container>
	);
};
