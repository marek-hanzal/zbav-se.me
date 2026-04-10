import type { AssistantMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		item: AssistantMessageItem;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({ item, ui, className, ...props }) => {
	const text = item.content
		.filter((c) => c.type === "output_text")
		.map((c) => c.text)
		.join("");

	return (
		<Group
			data-ui={"HistoryList-AssistantMessage"}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "alt",
				inner: "default",
				...ui,
			}}
			className={className}
			{...props}
		>
			<Markdown>{text}</Markdown>
		</Group>
	);
};
