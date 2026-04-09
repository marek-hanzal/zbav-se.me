import type { RunRawModelStreamEvent, RunStreamEvent } from "@openai/agents-core";
import { EventBus } from "@/lib/common/event-bus";

export namespace StreamEventBus {
	export type SourceEvent = Record<string, any>;

	export type WithRunRawModelStreamEvent<T> = T & {
		event: RunRawModelStreamEvent;
	};

	export interface ResponseEvents {
		"response.start": {};
		"response.done": {};
	}

	export interface Events extends ResponseEvents {
		_unhandled: {
			event: RunStreamEvent;
		};
	}
}

export type StreamEventBus = EventBus<StreamEventBus.Events>;

export const StreamEventBus = () => {
	return EventBus<StreamEventBus.Events>();
};
