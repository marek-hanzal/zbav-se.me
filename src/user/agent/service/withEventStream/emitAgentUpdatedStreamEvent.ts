import type { RunAgentUpdatedStreamEvent } from "@openai/agents-core";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace emitAgentUpdatedStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const emitAgentUpdatedStreamEvent = ({ eventBus }: emitAgentUpdatedStreamEvent.Props) => {
	return (event: RunAgentUpdatedStreamEvent) => {
		eventBus.emit("unhandled:agent-update-stream-event", {
			event,
		});
		eventBus.emit("unhandled:catch-all", {
			event,
		});
	};
};
