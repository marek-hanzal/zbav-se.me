import type { RunAgentUpdatedStreamEvent } from "@openai/agents-core";

export namespace withAgentUpdatedStreamEvent {
	export interface Props {
		enabled: true;
	}
}

export const withAgentUpdatedStreamEvent = (_props: withAgentUpdatedStreamEvent.Props) => {
	return (event: RunAgentUpdatedStreamEvent) => {
		console.log("withAgentUpdatedStreamEvent", event);
	};
};
