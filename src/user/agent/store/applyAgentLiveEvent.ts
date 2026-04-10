import { match, P } from "ts-pattern";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";
import type { AgentLiveStore } from "./AgentLiveStore";
import { withAgentLiveItemEvent } from "./withAgentLiveItemEvent";
import { withAgentLiveOutputItemEvent } from "./withAgentLiveOutputItemEvent";
import { withAgentLiveRunStatus } from "./withAgentLiveRunStatus";

export namespace applyAgentLiveEvent {
	export interface Result {
		patch: Partial<AgentLiveStore.State>;
		result: AgentLiveStore.ApplyEventResult;
	}
}

export const applyAgentLiveEvent = ({
	state,
	runId,
	event,
}: {
	state: AgentLiveStore.State;
	runId: string;
	event: AgentEvent;
}): applyAgentLiveEvent.Result => {
	const run = state.runById[runId];

	if (!run) {
		return {
			patch: {},
			result: {},
		};
	}

	return match(event)
		.with(
			{
				type: "response.created",
			},
			(event) => {
				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: {
								...run,
								responseId: event.response.id,
							},
						},
					},
					result: {},
				};
			},
		)
		.with(
			{
				type: "response.output_item.added",
			},
			(event) => {
				const next = withAgentLiveOutputItemEvent({
					run,
					slotById: state.slotById,
					runId,
					event,
				});

				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: next.run,
						},
						slotById: next.slotById,
					},
					result: {},
				};
			},
		)
		.with(
			{
				type: "response.output_item.done",
			},
			(event) => {
				const next = withAgentLiveOutputItemEvent({
					run,
					slotById: state.slotById,
					runId,
					event,
				});

				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: next.run,
						},
						slotById: next.slotById,
					},
					result: {},
				};
			},
		)
		.with(
			{
				type: "response.completed",
			},
			() => {
				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: withAgentLiveRunStatus({
								run,
								status: "completed",
							}),
						},
					},
					result: {
						terminalStatus: "completed",
					},
				};
			},
		)
		.with(
			{
				type: "response.failed",
			},
			() => {
				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: withAgentLiveRunStatus({
								run,
								status: "failed",
							}),
						},
					},
					result: {
						terminalStatus: "failed",
					},
				};
			},
		)
		.with(
			{
				type: "response.incomplete",
			},
			() => {
				return {
					patch: {
						runById: {
							...state.runById,
							[runId]: withAgentLiveRunStatus({
								run,
								status: "incomplete",
							}),
						},
					},
					result: {
						terminalStatus: "incomplete",
					},
				};
			},
		)
		.otherwise((event) => {
			const itemEvent = match(event)
				.with(
					{
						item_id: P.string,
						output_index: P.number,
					},
					(value) => value,
				)
				.otherwise(() => null);

			if (!itemEvent) {
				return {
					patch: {},
					result: {},
				};
			}

			const next = withAgentLiveItemEvent({
				run,
				slotById: state.slotById,
				runId,
				event: itemEvent,
			});

			return {
				patch: {
					runById: {
						...state.runById,
						[runId]: next.run,
					},
					slotById: next.slotById,
				},
				result: {},
			};
		});
};
