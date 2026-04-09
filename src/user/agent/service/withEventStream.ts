import type { RunStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";
import { withAgentUpdatedStreamEvent } from "~/user/agent/service/withEventStream/withAgentUpdatedStreamEvent";
import { withRawModelStreamEvent } from "~/user/agent/service/withEventStream/withRawModelStreamEvent";
import { withRunItemStreamEvent } from "~/user/agent/service/withEventStream/withRunItemStreamEvent";

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
	return (event: RunStreamEvent) => {
		return match(event)
			.with(
				{
					type: "raw_model_stream_event",
				},
				withRawModelStreamEvent({
					eventBus,
				}),
			)
			.with(
				{
					type: "run_item_stream_event",
				},
				withRunItemStreamEvent({
					eventBus,
				}),
			)
			.with(
				{
					type: "agent_updated_stream_event",
				},
				withAgentUpdatedStreamEvent({
					eventBus,
				}),
			)
			.otherwise((event) => {
				eventBus.emit("unhandled:unknown", {
					event,
				});
				eventBus.emit("unhandled:catch-all", {
					event,
				});
			});
	};
};
