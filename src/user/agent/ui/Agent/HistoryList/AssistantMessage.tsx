import type { AssistantMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";

export namespace AssistantMessage {
	export interface Props extends Container.Props {
		item: AssistantMessageItem;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({ item, ui, ...props }) => {
	const text = item.content
		.filter((c) => c.type === "output_text")
		.map((c) => c.text)
		.join("");

	return (
		<Container
			data-ui={"AssistantMessage"}
			ui={{
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<Markdown>{text}</Markdown>
		</Container>
	);
};
