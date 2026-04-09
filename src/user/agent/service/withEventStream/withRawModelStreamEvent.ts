import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withRawModelStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withRawModelStreamEvent = ({ eventBus }: withRawModelStreamEvent.Props) => {
	return (event: RunRawModelStreamEvent) => {
		return (
			match(event)
				// 	.with(
				// 		{
				// 			data: {
				// 				type: "response_started",
				// 				providerData: {
				// 					type: "response.created",
				// 					response: {
				// 						id: P.string,
				// 					},
				// 				},
				// 			},
				// 		},
				// 		(event) => {
				// 			eventBus.emit("onStart", {
				// 				id: event.data.providerData.response.id,
				// 				event,
				// 			});
				// 		},
				// 	)
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
				// 			response: {
				// 				id: P.string,
				// 			},
				// 			type: "response_done",
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("onDone", {
				// 			id: event.data.response.id,
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
				// 						item_id: P.string,
				// 						event: {
				// 							type: "response.content_part.added",
				// 							part: {
				// 								text: P.string,
				// 								type: "reasoning_text",
				// 							},
				// 						},
				// 					},
				// 				},
				// 				(event) => {
				// 					eventBus.emit("onReasoningContent", {
				// 						id: event.data.item_id,
				// 						text: event.data.event.part.text,
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
				// 				eventBus.emit("onUnhandled", {
				// 					event,
				// 				});
				// 			});
				// 	},
				// )
				.otherwise((event) => {
					eventBus.emit("_unhandled", {
						event,
					});
				})
		);
	};
};
