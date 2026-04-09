import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withRawModelStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withRawModelStreamEvent = ({ eventBus }: withRawModelStreamEvent.Props) => {
	return <const TEvent extends RunRawModelStreamEvent>(event: TEvent) => {
		return (
			match(event)
				// .with(
				// 	{
				// 		data: {
				// 			type: "response_started",
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("onStart", {
				// 			event,
				// 		});
				// 	},
				// )
				// .with(
				// 	{
				// 		data: {
				// 			type: "output_text_delta",
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("onTextDelta", {
				// 			text: event.data.delta,
				// 			event,
				// 		});
				// 	},
				// )
				// .with(
				// 	{
				// 		data: {
				// 			type: "response_done",
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("onDone", {
				// 			event,
				// 		});
				// 	},
				// )
				// .with(
				// 	{
				// 		data: {
				// 			type: "model",
				// 		},
				// 	},
				// 	(event) => {
				// 		match(event)
				// 			.with(
				// 				{
				// 					data: {
				// 						event: {
				// 							type: "response.created",
				// 						},
				// 						providerData: P.any,
				// 					},
				// 				},
				// 				(event) => {
				// 					eventBus.emit("onResponseCreated", {
				// 						event,
				// 					});
				// 				},
				// 			)
				// 			.with(
				// 				{
				// 					data: {
				// 						event: {
				// 							type: "response.output_item.added",
				// 						},
				// 						item: {
				// 							id: P.string,
				// 							type: "reasoning",
				// 						},
				// 						providerData: P.any,
				// 					},
				// 				},
				// 				(event) => {
				// 					eventBus.emit("onReasoningStart", {
				// 						id: event.data.item.id,
				// 						event,
				// 					});
				// 				},
				// 			)
				// 			.otherwise((event) => {
				// 				console.log("Unhandled", event);
				// 			});
				// 	},
				// )
				.otherwise((event) => {
					eventBus.emit("onUnhandled", {
						event,
					});
				})
		);
	};
};
