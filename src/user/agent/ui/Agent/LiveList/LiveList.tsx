import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { AssistantMessage } from "./AssistantMessage";
import { ErrorMessage } from "./ErrorMessage";
import { selectLiveEntries } from "./selectLiveEntries";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ToolCallBlock } from "./ToolCallBlock";

export namespace LiveList {
	export interface Props extends Container.Props {
		//
	}
}

export const LiveList: FC<LiveList.Props> = ({ ...props }) => {
	const { data: events } = withAgentLiveQuery.useQuery("No input data here, bro");
	const entries = selectLiveEntries(events);

	return (
		<Container
			data-ui={"LiveList"}
			data-ui-flow="vertical"
			data-ui-gap="default"
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
