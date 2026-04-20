import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";

export namespace MessageTextContent {
	export interface Props extends Group.Props {
		groupId?: string;
		text: string;
	}
}

export const MessageTextContent: FC<MessageTextContent.Props> = ({ groupId, text, ...props }) => {
	const value = text.trim();
	if (!value.length) {
		return null;
	}

	return (
		<Group
			data-ui={"MessageTextContent"}
			data-id={groupId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			{...props}
		>
			<Markdown>{value}</Markdown>
		</Group>
	);
};
