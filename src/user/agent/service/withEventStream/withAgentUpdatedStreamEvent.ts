import type { RunAgentUpdatedStreamEvent } from "@openai/agents-core";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withAgentUpdatedStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withAgentUpdatedStreamEvent = ({ eventBus }: withAgentUpdatedStreamEvent.Props) => {
	return <const TEvent extends RunAgentUpdatedStreamEvent>(event: TEvent) => {
		eventBus.emit("_unhandled", {
			event,
		});
	};
};
