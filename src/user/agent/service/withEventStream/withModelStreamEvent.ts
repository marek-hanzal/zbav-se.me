import type { RunRawModelStreamEvent } from "@openai/agents-core";
import { match, P } from "ts-pattern";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withModelStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withModelStreamEvent = ({ eventBus }: withModelStreamEvent.Props) => {
	return (event: RunRawModelStreamEvent) => {
		return match(event)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.created",
							response: {
								id: P.string,
							},
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.created", {
						id: event.data.event.response.id,
						event,
					});
				},
			)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.in_progress",
							response: {
								id: P.string,
							},
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.progress", {
						id: event.data.event.response.id,
						event,
					});
				},
			)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.output_item.added",
							item: {
								id: P.string,
								type: "reasoning",
							},
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.reasoning.item.added", {
						id: event.data.event.item.id,
						event,
					});
				},
			)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.content_part.added",
							item_id: P.string,
							part: {
								type: "reasoning_text",
							},
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.reasoning.content.added", {
						id: event.data.event.item_id,
						event,
					});
				},
			)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.reasoning_text.delta",
							delta: P.string,
							item_id: P.string,
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.reasoning.delta", {
						id: event.data.event.item_id,
						text: event.data.event.delta,
						event,
					});
				},
			)
			.with(
				{
					data: {
						type: "model",
						event: {
							type: "response.reasoning_text.done",
							text: P.string,
							item_id: P.string,
						},
						providerData: P.any,
					},
				},
				(event) => {
					eventBus.emit("model:response.reasoning.done", {
						id: event.data.event.item_id,
						text: event.data.event.text,
						event,
					});
				},
			)
			.otherwise((event) => {
				eventBus.emit("unhandled:raw-model-stream-event", {
					event,
				});
				eventBus.emit("unhandled:catch-all", {
					event,
				});
			});
	};
};
