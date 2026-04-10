import type { FunctionCallResultItem, RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getFunctionCallResultItem, getResponseStreamEvent } from "~/user/agent/type/AgentEvent";

interface ToolCallState {
	name: string;
	isComplete: boolean;
	input: string | null;
	output: string | null;
}

function getOutputText(result: FunctionCallResultItem | undefined): string | null {
	if (!result) {
		return null;
	}

	const { output } = result;

	if (typeof output === "string") {
		return output;
	}

	if (Array.isArray(output)) {
		return null;
	}

	if (output.type === "text") {
		return output.text;
	}

	return null;
}

function selectToolCallState(events: RunStreamEvent[] | undefined, itemId: string): ToolCallState {
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
		isComplete: !!doneEvent,
		input: doneArgs,
		output: getOutputText(result),
	};
}

export namespace ToolCallBlock {
	export interface Props extends Container.Props {
		itemId: string;
	}
}

export const ToolCallBlock: FC<ToolCallBlock.Props> = ({ itemId, ui, ...props }) => {
	const { data: state } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) => selectToolCallState(events, itemId) as unknown as RunStreamEvent[],
	}) as unknown as {
		data: ToolCallState | undefined;
	};

	if (!state) {
		return null;
	}

	return (
		<Container
			data-ui={"LiveList-ToolCallBlock"}
			data-id={itemId}
			ui={{
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			{!state.isComplete ? (
				<SpinnerContainer
					type="icon"
					ui={{
						layout: "horizontal-flex",
						height: undefined,
						items: "center",
						gap: "xs",
					}}
				/>
			) : (
				<Container
					ui={{
						flow: "vertical",
						gap: "xs",
					}}
				>
					<Typo
						label={state.name}
						ui={{
							text: "sm",
							font: "semibold",
						}}
					/>
					{state.input !== null ? (
						<Container
							ui={{
								flow: "vertical",
								gap: "xs",
							}}
						>
							<Typo
								label={translator.text("Tool call input (label)")}
								ui={{
									text: "xs",
									opacity: "6",
									font: "semibold",
								}}
							/>
							<Typo
								label={state.input}
								ui={{
									text: "xs",
									opacity: "6",
								}}
							/>
						</Container>
					) : null}
					{state.output !== null ? (
						<Container
							ui={{
								flow: "vertical",
								gap: "xs",
							}}
						>
							<Typo
								label={translator.text("Tool call output (label)")}
								ui={{
									text: "xs",
									opacity: "6",
									font: "semibold",
								}}
							/>
							<Typo
								label={state.output}
								ui={{
									text: "xs",
									opacity: "8",
								}}
							/>
						</Container>
					) : null}
				</Container>
			)}
		</Container>
	);
};
