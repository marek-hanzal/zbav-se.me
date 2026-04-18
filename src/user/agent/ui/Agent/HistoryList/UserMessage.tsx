import type { UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";

export namespace UserMessage {
	export interface Props extends Group.Props {
		item: UserMessageItem;
	}
}

export const UserMessage: FC<UserMessage.Props> = ({ item, className, ...props }) => {
	const text =
		typeof item.content === "string"
			? item.content
			: item.content
					.filter((c) => c.type === "input_text")
					.map((c) => c.text)
					.join("");

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
			<Markdown>{text}</Markdown>
		</Group>
	);
};
