import type { FC } from "react";
import { match } from "ts-pattern";
import type { Group } from "~/ui/ui/Group";
import type { MessageContent } from "~/user-agent/ui/Agent/HistoryList/MessageContent/MessageContent";
import { MessageImageContent } from "~/user-agent/ui/Agent/HistoryList/MessageContent/MessageImageContent";
import { MessageTextContent } from "~/user-agent/ui/Agent/HistoryList/MessageContent/MessageTextContent";

export namespace MessageContentPart {
	export interface Props extends Omit<Group.Props, "part"> {
		groupId?: string;
		part: MessageContent.Part;
	}
}

export const MessageContentPart: FC<MessageContentPart.Props> = ({ groupId, part, ...props }) => {
	return match(part)
		.with(
			{
				type: "input_text",
			},
			(part) => (
				<MessageTextContent
					groupId={groupId}
					text={part.text}
					{...props}
				/>
			),
		)
		.with(
			{
				type: "output_text",
			},
			(part) => (
				<MessageTextContent
					groupId={groupId}
					text={part.text}
					{...props}
				/>
			),
		)
		.with(
			{
				type: "refusal",
			},
			(part) => (
				<MessageTextContent
					groupId={groupId}
					text={part.refusal}
					{...props}
				/>
			),
		)
		.with(
			{
				type: "input_image",
			},
			(part) => (
				<MessageImageContent
					groupId={groupId}
					image={part.image}
					{...props}
				/>
			),
		)
		.with(
			{
				type: "image",
			},
			(part) => (
				<MessageImageContent
					groupId={groupId}
					image={part.image}
					{...props}
				/>
			),
		)
		.otherwise(() => null);
};
