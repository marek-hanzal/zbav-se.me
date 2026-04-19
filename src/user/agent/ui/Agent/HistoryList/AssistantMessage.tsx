import type { AssistantMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { MessageContent } from "./MessageContent";

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		item: AssistantMessageItem;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({ item, ...props }) => {
	if (!item.content.length) {
		return null;
	}

	return (
		<Group
			data-ui={"AssistantMessage"}
			data-id={item.id}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			{...props}
		>
			<MessageContent content={item.content} />
		</Group>
	);
};
