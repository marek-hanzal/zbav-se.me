import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

interface ToolCallState {
	name: string;
	isComplete: boolean;
	input: string | null;
	output: string | null;
}

function selectToolCallState(events: AgentEvent[] | undefined, callId: string): ToolCallState {
	const all = events ?? [];

	const created = all.find(
		(e) =>
			e.type === "response.output_item.added" &&
			e.item.type === "function_call" &&
			e.item.call_id === callId,
	);

	const done = all.find(
		(e) => e.type === "response.function_call_arguments.done" && e.item_id === callId,
	);

	const createdName =
		created &&
		created.type === "response.output_item.added" &&
		created.item.type === "function_call"
			? created.item.name
			: "";

	const doneArgs =
		done && done.type === "response.function_call_arguments.done" ? done.arguments : null;

	return {
		name: createdName,
		isComplete: !!done,
		input: doneArgs,
		output: null,
	};
}

export namespace ToolCallBlock {
	export interface Props extends Container.Props {
		callId: string;
	}
}

export const ToolCallBlock: FC<ToolCallBlock.Props> = ({ callId, ui, ...props }) => {
	const { data: state } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) => selectToolCallState(events, callId) as unknown as AgentEvent[],
	}) as unknown as {
		data: ToolCallState | undefined;
	};

	if (!state) {
		return null;
	}

	return (
		<Container
			data-ui={"LiveList-ToolCallBlock"}
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
						<Typo
							label={state.input}
							ui={{
								text: "xs",
								opacity: "6",
							}}
						/>
					) : null}
				</Container>
			)}
		</Container>
	);
};
