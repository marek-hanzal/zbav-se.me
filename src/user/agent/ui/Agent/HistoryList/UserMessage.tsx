import type { UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";

export namespace UserMessage {
	export interface Props extends Container.Props {
		item: UserMessageItem;
	}
}

export const UserMessage: FC<UserMessage.Props> = ({ item, ui, ...props }) => {
	const text =
		typeof item.content === "string"
			? item.content
			: item.content
					.filter((c) => c.type === "input_text")
					.map((c) => c.text)
					.join("");

	return (
		<Container
			data-ui={"UserMessage"}
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
