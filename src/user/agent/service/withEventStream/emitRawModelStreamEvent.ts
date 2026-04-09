import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match, P } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";
import { emitModelEvent } from "./emitModelEvent";

export namespace emitRawModelStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const emitRawModelStreamEvent = ({ eventBus }: emitRawModelStreamEvent.Props) => {
	return (event: RunRawModelStreamEvent) => {
		return (
			match(event)
				// .with(
				// 	{
				// 		data: {
				// 			type: "response_started",
				// 			providerData: {
				// 				type: "response.created",
				// 				response: {
				// 					id: P.string,
				// 				},
				// 			},
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("response:start", {
				// 			id: event.data.providerData.response.id,
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
				// 			response: {
				// 				id: P.string,
				// 			},
				// 			type: "response_done",
				// 		},
				// 	},
				// 	(event) => {
				// 		eventBus.emit("response:done", {
				// 			id: event.data.response.id,
				// 			event,
				// 		});
				// 	},
				// )
				.with(
					{
						type: "raw_model_stream_event",
						source: P.string,
						data: {
							type: "model",
							event: {
								type: P.string,
							},
						},
					},
					emitModelEvent({
						eventBus,
					}),
				)
				.otherwise((event) => {
					eventBus.emit("unhandled:raw-model-stream-event", {
						event,
					});
					eventBus.emit("unhandled:catch-all", {
						event,
					});
				})
		);
	};
};
