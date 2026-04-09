import { EventBus } from "@/lib/common/event-bus";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

export namespace StreamEventBus {
	export interface ResponseEvents {
		"response:created": Extract<
			AgentEvent,
			{
				type: "response.created";
			}
		>;
		"response:completed": Extract<
			AgentEvent,
			{
				type: "response.completed";
			}
		>;
	}

	export interface UnhandledEvents {
		unhandled: {
			event: AgentEvent;
		};
	}

	export type Events = ResponseEvents & UnhandledEvents;
}

export type StreamEventBus = EventBus<StreamEventBus.Events>;

export const StreamEventBus = () => {
	return EventBus<StreamEventBus.Events>();
};
