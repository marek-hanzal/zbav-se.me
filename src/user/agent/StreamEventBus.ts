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
		"response:done": WithRunRawModelStreamEvent<{
			id: string;
		}>;
	}

	export interface ModelEvents {
		"model:response.created": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		"model:response.progress": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		//
		"model:response.reasoning.item.added": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		"model:response.reasoning.content.added": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		"model:response.reasoning.content.done": WithRunRawModelStreamEvent<{
			id: string;
		}>;
		//
		"model:response.reasoning.delta": WithRunRawModelStreamEvent<{
			id: string;
			text: string;
		}>;
		"model:response.reasoning.done": WithRunRawModelStreamEvent<{
			id: string;
			text: string;
		}>;
	}

	export interface UnhandledEvents {
		"unhandled:agent-update-stream-event": {
			event: RunAgentUpdatedStreamEvent;
		};
		"unhandled:raw-model-stream-event": {
			event: RunRawModelStreamEvent;
		};
		"unhandled:raw-model-stream-event.event": {
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

	export type Events = ResponseEvents & ModelEvents & UnhandledEvents;
}

export type StreamEventBus = EventBus<StreamEventBus.Events>;

export const StreamEventBus = () => {
	return EventBus<StreamEventBus.Events>();
};
