import type { UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { MessageContent } from "./MessageContent";

export namespace UserMessage {
	export interface Props extends Group.Props {
		item: UserMessageItem;
	}
}

export const UserMessage: FC<UserMessage.Props> = ({ item, className, ...props }) => {
	return (
		<Group
			data-ui={"UserMessage"}
			data-ui-tone="subtle"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			className={[
				"w-4/5",
				"ml-auto",
				className,
			]}
			{...props}
		>
			<MessageContent content={item.content} />
		</Group>
	);
};
