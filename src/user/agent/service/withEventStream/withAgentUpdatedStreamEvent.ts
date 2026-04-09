import type { RunAgentUpdatedStreamEvent } from "@openai/agents-core";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withAgentUpdatedStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withAgentUpdatedStreamEvent = ({ eventBus }: withAgentUpdatedStreamEvent.Props) => {
	return (event: RunAgentUpdatedStreamEvent) => {
		eventBus.emit("unhandled:agent-update-stream-event", {
			event,
		});
		eventBus.emit("unhandled:catch-all", {
			event,
		});
	};
};
