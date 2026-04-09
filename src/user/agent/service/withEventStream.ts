import type { RunStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";
import { withRawModelStreamEvent } from "~/user/agent/service/withEventStream/withRawModelStreamEvent";
import { withRunItemStreamEvent } from "~/user/agent/service/withEventStream/withRunItemStreamEvent";

export namespace withEventStream {
	export interface Props {
		enabled: true;
	}
}

export const withEventStream = (_props: withEventStream.Props) => {
	return (event: RunStreamEvent) => {
		return match(event)
			.with(
				{
					type: "raw_model_stream_event",
				},
				withRawModelStreamEvent({
					enabled: true,
				}),
			)
			.with(
				{
					type: "run_item_stream_event",
				},
				withRunItemStreamEvent({
					enabled: true,
				}),
			)
			.with(
				{
					type: "agent_updated_stream_event",
				},
				(event) => {
					return console.log("Agent Updated Event", event);
				},
			)
			.exhaustive();
	};
};
