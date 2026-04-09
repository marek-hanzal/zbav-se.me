import type {
	RunAgentUpdatedStreamEvent,
	RunItemStreamEvent,
	RunRawModelStreamEvent,
	RunStreamEvent,
} from "@openai/agents-core";
import { EventBus } from "@/lib/common/event-bus";

export namespace StreamEventBus {
	export type WithRunRawModelStreamEvent<T> = T & {
		event: RunRawModelStreamEvent;
	};

	export interface ResponseEvents {
		"response:start": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		"response:done": {};
	}

	export interface UnhandledEvents {
		"unhandled:agent-update-stream-event": {
			event: RunAgentUpdatedStreamEvent;
		};
		"unhandled:raw-model-stream-event": {
			event: RunRawModelStreamEvent;
		};
		"unhandled:run-item-stream-event": {
			event: RunItemStreamEvent;
		};
		//
		"unhandled:catch-all": {
			event: RunStreamEvent;
		};
		"unhandled:unknown": {
			event: RunStreamEvent;
		};
	}

	export type Events = ResponseEvents & UnhandledEvents;
}

export type StreamEventBus = EventBus<StreamEventBus.Events>;

export const StreamEventBus = () => {
	return EventBus<StreamEventBus.Events>();
};
