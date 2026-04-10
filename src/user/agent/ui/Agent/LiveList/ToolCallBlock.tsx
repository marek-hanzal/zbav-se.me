import type { FunctionCallResultItem, RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getFunctionCallResultItem, getResponseStreamEvent } from "~/user/agent/type/AgentEvent";

interface ToolCallState {
	name: string;
	input: string | null;
	output: string | undefined;
	isPending: boolean;
}

function getOutputText(result: FunctionCallResultItem | undefined): string | undefined {
	if (!result) {
		return undefined;
	}

	const { output } = result;

	if (typeof output === "string") {
		return output;
	}

	if (Array.isArray(output)) {
		return undefined;
	}

	if (output.type === "text") {
		return output.text;
	}

	return undefined;
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
		input: doneArgs,
		output: getOutputText(result),
		isPending: !result,
	};
}

export namespace ToolCallBlock {
	export interface Props extends Group.Props {
		itemId: string;
	}
}

export const ToolCallBlock: FC<ToolCallBlock.Props> = ({ itemId, ui, className, ...props }) => {
	const { data: state } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) => selectToolCallState(events, itemId) as unknown as RunStreamEvent[],
	}) as unknown as {
		data: ToolCallState | undefined;
	};

	if (!state) {
		return null;
	}

	return (
		<Group
			data-ui={"ToolCallBlock"}
			data-id={itemId}
			data-output-id={itemId}
			ui={{
				tone: "secondary",
				theme: "light",
				background: "alt",
				inner: "default",
				opacity: "8",
				...ui,
			}}
			className={className}
			{...props}
		>
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
						font: "bold",
					}}
				/>

				{state.input !== null ? (
					<>
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
								opacity: "8",
							}}
						/>
					</>
				) : null}

				{state.isPending ? (
					<SpinnerContainer
						data-ui={"ToolCallBlock-[Spinner]"}
						type="icon"
						size="md"
						ui={{
							layout: "horizontal-flex",
							height: undefined,
							width: undefined,
							color: "lead",
						}}
					/>
				) : null}

				{state.output !== undefined ? (
					<>
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
					</>
				) : null}
			</Container>
		</Group>
	);
};
