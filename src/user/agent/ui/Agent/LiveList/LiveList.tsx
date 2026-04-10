import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";
import { AssistantMessage } from "./AssistantMessage";
import { ErrorMessage } from "./ErrorMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";

function selectOutputIndices(events: AgentEvent[] | undefined): number[] {
	const seen = new Set<number>();
	const result: number[] = [];

	for (const event of events ?? []) {
		if (event.type === "response.output_item.added" && !seen.has(event.output_index)) {
			seen.add(event.output_index);
			result.push(event.output_index);
		}
	}

	return result;
}

export namespace LiveList {
	export interface Props extends Container.Props {
        //
    }
}

export const LiveList: FC<LiveList.Props> = ({ ui, ...props }) => {
	const { data: events } = withAgentLiveQuery.useQuery(undefined);
	const outputIndices = selectOutputIndices(events);

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

			{outputIndices.map((outputIndex) => (
				<AssistantMessage
					key={outputIndex}
					outputIndex={outputIndex}
				/>
			))}

			<ErrorMessage />
		</Container>
	);
};
