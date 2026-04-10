import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getResponseStreamEvent } from "~/user/agent/type/AgentEvent";
import { AssistantMessage } from "./AssistantMessage";
import { ErrorMessage } from "./ErrorMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ToolCallBlock } from "./ToolCallBlock";

interface LiveEntryBase {
	itemId: string;
}

interface LiveAssistantEntry extends LiveEntryBase {
	type: "assistant";
}

interface LiveToolCallEntry extends LiveEntryBase {
	type: "tool-call";
}

type LiveEntry = LiveAssistantEntry | LiveToolCallEntry;

function selectLiveEntries(events: RunStreamEvent[] | undefined): LiveEntry[] {
	const seen = new Set<string>();
	const entries: LiveEntry[] = [];

	for (const event of events ?? []) {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (
			responseEvent.type !== "response.output_item.added" ||
			!responseEvent.item.id ||
			seen.has(responseEvent.item.id)
		) {
			continue;
		}

		seen.add(responseEvent.item.id);

		if (responseEvent.item.type === "function_call") {
			entries.push({
				type: "tool-call",
				itemId: responseEvent.item.id,
			});
			continue;
		}

		if (responseEvent.item.type === "message") {
			entries.push({
				type: "assistant",
				itemId: responseEvent.item.id,
			});
		}
	}

	return entries;
}

export namespace LiveList {
	export interface Props extends Container.Props {
		//
	}
}

export const LiveList: FC<LiveList.Props> = ({ ui, ...props }) => {
	const { data: events } = withAgentLiveQuery.useQuery(undefined);
	const entries = selectLiveEntries(events);

	return (
		<Container
			data-ui={"LiveList"}
			ui={{
				flow: "vertical",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<ThinkingIndicator />

			{entries.map((entry) => {
				if (entry.type === "tool-call") {
					return (
						<ToolCallBlock
							key={`tool-call-${entry.itemId}`}
							itemId={entry.itemId}
						/>
					);
				}

				return (
					<AssistantMessage
						key={`assistant-${entry.itemId}`}
						itemId={entry.itemId}
					/>
				);
			})}

			<ErrorMessage />
		</Container>
	);
};
