import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

interface LiveMessageState {
	content: string;
	toolCallIds: string[];
	isComplete: boolean;
}

function deriveLiveMessageState(events: AgentEvent[]): LiveMessageState {
	let content = "";
	const toolCallIds: string[] = [];
	let isComplete = false;

	for (const event of events) {
		if (event.type === "response.output_text.delta") {
			content += event.delta;
		} else if (event.type === "response.output_text.done") {
			content = event.text;
		} else if (
			event.type === "response.output_item.added" &&
			event.item.type === "function_call" &&
			event.item.call_id
		) {
			if (!toolCallIds.includes(event.item.call_id)) {
				toolCallIds.push(event.item.call_id);
			}
		} else if (event.type === "response.output_item.done") {
			isComplete = true;
		}
	}

	return {
		content,
		toolCallIds,
		isComplete,
	};
}

function selectAssistantMessageState(
	events: AgentEvent[] | undefined,
	outputIndex: number,
): LiveMessageState {
	const mine = (events ?? []).filter(
		(e) => "output_index" in e && e.output_index === outputIndex,
	);
	return deriveLiveMessageState(mine);
}

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		outputIndex: number;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({
	outputIndex,
	ui,
	className,
	...props
}) => {
	const { data: state } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) =>
			selectAssistantMessageState(events, outputIndex) as unknown as AgentEvent[],
	}) as unknown as {
		data: LiveMessageState | undefined;
	};

	if (!state?.content.trim().length) {
		return null;
	}

	return (
		<Group
			data-ui={"AssistantMessage"}
			data-id={outputIndex}
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
