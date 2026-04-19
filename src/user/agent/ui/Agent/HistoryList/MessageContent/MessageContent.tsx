import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { getMessageContentParts, type MessageContentValue } from "./getMessageContentParts";
import { getPartKey } from "./getPartKey";
import { MessageContentPart } from "./MessageContentPart";

type MessageContentContainerProps = Omit<Container.Props, "content">;

export namespace MessageContent {
	export interface Props extends MessageContentContainerProps {
		content: MessageContentValue;
	}
}

export const MessageContent: FC<MessageContent.Props> = ({ content, ...props }) => {
	const countByFingerprint = new Map<string, number>();
	const parts = getMessageContentParts(content);

	if (!parts.length) {
		return null;
	}

	return (
		<Container
			data-ui={"MessageContent"}
			data-ui-flow="vertical"
			data-ui-gap="xs"
			{...props}
		>
			{parts.map((part) => (
				<MessageContentPart
					key={getPartKey(part, countByFingerprint)}
					part={part}
				/>
			))}
		</Container>
	);
};
