import { match } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

export namespace withEventStream {
	export interface Props {
		eventBus: StreamEventBus;
	}
}
/**
 * This is an entry point for single stream of events for one agentic loop (user request -> stream -> response).
 *
 * It self-manages internal state, so it's safe to use between agentic loops.
 */
export const withEventStream = ({ eventBus }: withEventStream.Props) => {
	return (event: AgentEvent) => {
		return (
			match(event)
				//
				.otherwise((event) => {
					eventBus.emit("unhandled", {
						event,
					});
				})
		);
	};
};
