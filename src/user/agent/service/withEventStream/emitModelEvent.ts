import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace emitModelEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const emitModelEvent = ({ eventBus }: emitModelEvent.Props) => {
	return (event: RunRawModelStreamEvent) => {
		return (
			match(event)
				//
				.otherwise((event) => {
					eventBus.emit("unhandled:raw-model-stream-event.event", {
						event,
					});
					eventBus.emit("unhandled:catch-all", {
						event,
					});
				})
		);
	};
};
