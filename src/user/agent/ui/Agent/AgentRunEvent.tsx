import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { Tx } from "@/lib/client/tx";

export namespace AgentRunEvent {
	export interface Props extends Container.Props {
		event: unknown;
	}
}

export const AgentRunEvent: FC<AgentRunEvent.Props> = ({ event, ui, ...props }) => {
	return match(event)
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: "response.output_text.delta",
						delta: P.string,
					},
				},
			},
			(event) => {
				return (
					<Container
						ui={{
							...ui,
						}}
						{...props}
					>
						<Markdown>{event.data.event.delta}</Markdown>
					</Container>
				);
			},
		)
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: P.union(
							"response.reasoning_text.delta",
							"response.reasoning_summary_text.delta",
						),
						delta: P.string,
					},
				},
			},
			(event) => {
				return (
					<Container
						ui={{
							text: "sm",
							inner: "default",
							opacity: "6",
							...ui,
						}}
						{...props}
					>
						<Tx label={event.data.event.delta} />
					</Container>
				);
			},
		)
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: "response.function_call_arguments.delta",
						delta: P.string,
					},
				},
			},
			(event) => {
				return (
					<Container
						data-ui={"AgentRunEvent-[ToolCallDelta]"}
						ui={{
							border: true,
							round: "default",
							inner: "default",
							background: "alt",
							...ui,
						}}
						{...props}
					>
						<div className={"text-xs font-semibold uppercase opacity-60"}>
							<Tx label={"Tool input delta"} />
						</div>

						<pre className={"whitespace-pre-wrap break-words text-sm"}>
							{event.data.event.delta}
						</pre>
					</Container>
				);
			},
		)
		.with(
			{
				type: "run_item_stream_event",
				name: P.union(
					"tool_called",
					"tool_search_called",
					"tool_output",
					"tool_search_output_created",
				),
				item: P.any,
			},
			(event) => {
				return (
					<Container
						data-ui={"AgentRunEvent-[RunItem]"}
						ui={{
							border: true,
							round: "default",
							inner: "default",
							background: "alt",
							gap: "xs",
							flow: "vertical",
							...ui,
						}}
						{...props}
					>
						<div className={"text-xs font-semibold uppercase opacity-60"}>
							<Tx label={event.name} />
						</div>

						<pre className={"whitespace-pre-wrap break-words text-sm"}>
							{JSON.stringify(event.item, null, 2)}
						</pre>
					</Container>
				);
			},
		)
		.otherwise(() => null);
};
