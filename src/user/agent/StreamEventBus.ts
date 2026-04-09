import type { RunRawModelStreamEvent, RunStreamEvent } from "@openai/agents-core";
import { EventBus } from "@/lib/common/event-bus";

export namespace StreamEventBus {
	export type SourceEvent = Record<string, any>;

	export type WithRunRawModelStreamEvent<T> = T & {
		event: RunRawModelStreamEvent;
	};

	export interface Events {
		onStart: WithRunRawModelStreamEvent<{}>;
		onDone: WithRunRawModelStreamEvent<{}>;
		//
		onResponseCreated: WithRunRawModelStreamEvent<{}>;
		//
		onReasoningStart: WithRunRawModelStreamEvent<{
			id: string;
		}>;
		//
		onTextDelta: WithRunRawModelStreamEvent<{
			text: string;
		}>;
		//
		onUnhandled: {
			event: RunStreamEvent;
		};
	}
}

export type StreamEventBus = EventBus<StreamEventBus.Events>;

export const StreamEventBus = () => {
	return EventBus<StreamEventBus.Events>();
};
