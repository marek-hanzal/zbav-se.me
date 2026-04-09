import type { RunItemStreamEvent } from "@openai/agents-core";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withRunItemStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withRunItemStreamEvent = ({ eventBus }: withRunItemStreamEvent.Props) => {
	return (event: RunItemStreamEvent) => {
		eventBus.emit("unhandled:run-item-stream-event", {
			event,
		});
		eventBus.emit("unhandled:catch-all", {
			event,
		});
	};
};
