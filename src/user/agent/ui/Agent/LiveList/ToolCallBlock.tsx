import type { FunctionCallResultItem, RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { getFunctionCallResultItem } from "~/user/agent/type/getFunctionCallResultItem";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";
import { getToolOutputText } from "~/user/agent/type/getToolOutputText";

export namespace ToolCallBlock {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
		itemId: string;
		inline: boolean;
	}
}

export const ToolCallBlock: FC<ToolCallBlock.Props> = ({
	events,
	itemId,
	inline,
	className,
	...props
}) => {
	const state = useToolCalls(events, itemId);

	if (inline) {
		return (
			<Group
				data-ui={"ToolCallBlock"}
				data-id={itemId}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="alt"
				data-ui-inner="default"
				data-ui-opacity="6"
				{...props}
			>
				<Tx
					label={`Agent tool - ${state.name}`}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>
			</Group>
		);
	}

	return (
		<Group
			data-ui={"ToolCallBlock"}
			data-id={itemId}
			data-output-id={itemId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			className={className}
			{...props}
		>
			<Container
				data-ui-flow="vertical"
				data-ui-gap="xs"
				className={[
					"min-w-0",
				]}
			>
				<Typo
					label={state.name}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>

				{state.input !== null ? (
					<>
						<Typo
							label={translator.text("Tool call input (label)")}
							data-ui-text="xs"
							data-ui-opacity="6"
							data-ui-font="semibold"
						/>
						<Typo
							label={state.input}
							data-ui-text="xs"
							data-ui-opacity="8"
							className={[
								"wrap-break-word",
								"whitespace-pre-wrap",
							]}
						/>
					</>
				) : null}

				{state.isPending ? (
					<SpinnerContainer
						data-ui={"ToolCallBlock-[Spinner]"}
						type="icon"
						size="md"
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-layout="horizontal-flex"
						data-ui-height={undefined}
						data-ui-width={undefined}
						data-ui-color="lead"
					/>
				) : null}

				{state.output !== undefined ? (
					<>
						<Typo
							label={translator.text("Tool call output (label)")}
							data-ui-text="xs"
							data-ui-opacity="6"
							data-ui-font="semibold"
						/>
						<Typo
							label={state.output}
							data-ui-text="xs"
							data-ui-opacity="8"
							className={[
								"wrap-break-word",
								"whitespace-pre-wrap",
							]}
						/>
					</>
				) : null}
			</Container>
		</Group>
	);
};

// =================================================================================================

function useToolCalls(events: RunStreamEvent[] | undefined, itemId: string) {
	return useMemo(() => {
		const all = events ?? [];

		const created = all.find((event) => {
			const responseEvent = getResponseStreamEvent(event);

			return (
				responseEvent?.type === "response.output_item.added" &&
				responseEvent.item.type === "function_call" &&
				responseEvent.item.id === itemId
			);
		});

		const done = all.find((event) => {
			const responseEvent = getResponseStreamEvent(event);

			return (
				responseEvent?.type === "response.function_call_arguments.done" &&
				responseEvent.item_id === itemId
			);
		});

		const createdEvent = created ? getResponseStreamEvent(created) : null;
		const doneEvent = done ? getResponseStreamEvent(done) : null;

		const createdName =
			createdEvent &&
			createdEvent.type === "response.output_item.added" &&
			createdEvent.item.type === "function_call"
				? createdEvent.item.name
				: "";

		const doneArgs =
			doneEvent && doneEvent.type === "response.function_call_arguments.done"
				? doneEvent.arguments
				: null;
		const callId =
			createdEvent &&
			createdEvent.type === "response.output_item.added" &&
			createdEvent.item.type === "function_call"
				? createdEvent.item.call_id
				: null;
		const result = callId
			? all
					.map(getFunctionCallResultItem)
					.find(
						(event): event is FunctionCallResultItem =>
							event !== null && event.callId === callId,
					)
			: undefined;

		return {
			name: createdName,
			input: doneArgs,
			output: getToolOutputText(result),
			isPending: !result,
		} as const;
	}, [
		events,
		itemId,
	]);
}
