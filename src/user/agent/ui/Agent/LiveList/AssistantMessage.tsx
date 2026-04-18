import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";
import { selectAssistantMessageState } from "./selectAssistantMessageState";

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
		itemId: string;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({
	events,
	itemId,
	className,
	...props
}) => {
	const state = selectAssistantMessageState(events, itemId);

	if (!state.content.trim().length) {
		return null;
	}

	return (
		<Group
			data-ui={"AssistantMessage"}
			data-id={itemId}
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
			<Markdown>{state.content}</Markdown>
		</Group>
	);
};
