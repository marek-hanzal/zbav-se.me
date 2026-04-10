import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getResponseStreamEvent } from "~/user/agent/type/AgentEvent";

interface LiveMessageState {
	content: string;
	isComplete: boolean;
}

function deriveLiveMessageState(events: RunStreamEvent[]): LiveMessageState {
	let content = "";
	let isComplete = false;

	for (const event of events) {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (responseEvent.type === "response.output_text.delta") {
			content += responseEvent.delta;
		} else if (responseEvent.type === "response.output_text.done") {
			content = responseEvent.text;
		} else if (responseEvent.type === "response.output_item.done") {
			isComplete = true;
		}
	}

	return {
		content,
		isComplete,
	};
}

function selectAssistantMessageState(
	events: RunStreamEvent[] | undefined,
	itemId: string,
): LiveMessageState {
	const mine = (events ?? []).filter((event) => {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			return false;
		}

		if ("item_id" in responseEvent) {
			return responseEvent.item_id === itemId;
		}

		if (
			"item" in responseEvent &&
			responseEvent.item &&
			typeof responseEvent.item === "object" &&
			"id" in responseEvent.item
		) {
			return responseEvent.item.id === itemId;
		}

		return false;
	});

	return deriveLiveMessageState(mine);
}

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		itemId: string;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({
	itemId,
	ui,
	className,
	...props
}) => {
	const { data: state } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) =>
			selectAssistantMessageState(events, itemId) as unknown as RunStreamEvent[],
	}) as unknown as {
		data: LiveMessageState | undefined;
	};

	if (!state?.content.trim().length) {
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
