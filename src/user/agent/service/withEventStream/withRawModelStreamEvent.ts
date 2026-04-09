import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";

export namespace withRawModelStreamEvent {
	export interface Props {
		enabled: true;
	}
}

export const withRawModelStreamEvent = (_props: withRawModelStreamEvent.Props) => {
	return (event: RunRawModelStreamEvent) => {
		return match(event.data)
			.with(
				{
					type: "response_started",
				},
				(event) => {
					console.log("Response Started", event);
				},
			)
			.with(
				{
					type: "output_text_delta",
				},
				(event) => {
					console.log("Text Delta", event);
				},
			)
			.with(
				{
					type: "response_done",
				},
				(event) => {
					console.log("Response Done", event);
				},
			)
			.with(
				{
					type: "model",
				},
				(event) => {
					match(event)
						.with(
							{
								event: {
									type: "response.created",
								},
							},
							(event) => {
								console.log("\t\t - Response Created", event);
							},
						)
						.otherwise((event) => {
							console.log("\t\t - Unknown Model Event", event);
						});
				},
			)
			.exhaustive();
	};
};
