import type { RunStreamEvent } from "@openai/agents-core";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";
import { AssistantMessage } from "./AssistantMessage";
import { ErrorMessage } from "./ErrorMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ToolCallBlock } from "./ToolCallBlock";

export namespace LiveList {
	export interface Props extends Container.Props {
		//
	}
}

export const LiveList: FC<LiveList.Props> = ({ ...props }) => {
	const { data: events } = withAgentLiveQuery.useQuery("No input data here, bro");
	const entries = useLiveEntries(events);

	return (
		<Container
			data-ui={"LiveList"}
			data-ui-flow="vertical"
			data-ui-gap="lg"
			{...props}
		>
			{entries.map((entry) => {
				if (entry.type === "tool-call") {
					return (
						<ToolCallBlock
							key={`tool-call-${entry.itemId}`}
							events={events}
							itemId={entry.itemId}
							inline
						/>
					);
				}

				return (
					<AssistantMessage
						key={`assistant-${entry.itemId}`}
						events={events}
						itemId={entry.itemId}
					/>
				);
			})}

			<ThinkingIndicator events={events} />

			<ErrorMessage events={events} />
		</Container>
	);
};

// =================================================================================================

namespace useLiveEntries {
	interface Entry {
		itemId: string;
	}

	interface LiveAssistantEntry extends Entry {
		type: "assistant";
	}

	interface LiveToolCallEntry extends Entry {
		type: "tool-call";
	}

	export type LiveEntry = LiveAssistantEntry | LiveToolCallEntry;
}

function useLiveEntries(events: RunStreamEvent[] | undefined): useLiveEntries.LiveEntry[] {
	return useMemo(() => {
		const seen = new Set<string>();
		const entries: useLiveEntries.LiveEntry[] = [];

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
	}, [
		events,
	]);
}
