import type { AssistantMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		item: AssistantMessageItem;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({ item, ...props }) => {
	const text = item.content
		.filter((c) => c.type === "output_text")
		.map((c) => c.text)
		.join("")
		.trim();

	if (!text.length) {
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
			<Markdown>{text}</Markdown>
		</Group>
	);
};
