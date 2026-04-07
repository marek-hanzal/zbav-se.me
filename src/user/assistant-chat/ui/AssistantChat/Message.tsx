/** biome-ignore-all lint/suspicious/noArrayIndexKey: Ssst */
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { MessageUi } from "~/user/assistant/MessageUi";
import { ReasoningPart } from "./part/ReasoningPart";
import { TextPart } from "./part/TextPart";

export namespace Message {
	export interface Props extends Container.Props {
		message: MessageUi;
	}
}

export const Message: FC<Message.Props> = ({ message, ...props }) => {
	return (
		<Container {...props}>
			{message.parts.map((part, i) => {
				return (
					match(part)
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
						//
						.otherwise(() => {
							return "nope";
						})
				);
			})}
		</Container>
	);
};
