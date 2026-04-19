import type { FC } from "react";
import { match } from "ts-pattern";
import type { MessageContentPartValue } from "./getMessageContentParts";
import { MessageImageContent } from "./MessageImageContent";
import { MessageTextContent } from "./MessageTextContent";

export namespace MessageContentPart {
	export interface Props {
		part: MessageContentPartValue;
	}
}

export const MessageContentPart: FC<MessageContentPart.Props> = ({ part }) => {
	return match(part)
		.with(
			{
				type: "input_text",
			},
			(part) => <MessageTextContent text={part.text} />,
		)
		.with(
			{
				type: "output_text",
			},
			(part) => <MessageTextContent text={part.text} />,
		)
		.with(
			{
				type: "refusal",
			},
			(part) => <MessageTextContent text={part.refusal} />,
		)
		.with(
			{
				type: "input_image",
			},
			(part) => <MessageImageContent image={part.image} />,
		)
		.with(
			{
				type: "image",
			},
			(part) => <MessageImageContent image={part.image} />,
		)
		.otherwise(() => null);
};
