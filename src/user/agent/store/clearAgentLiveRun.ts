import type { AgentLiveStore } from "./AgentLiveStore";

export const clearAgentLiveRun = ({
	state,
	runId,
}: {
	state: AgentLiveStore.State;
	runId: string;
}): Partial<AgentLiveStore.State> => {
	const run = state.runById[runId];

	if (!run) {
		return {};
	}

	const nextRunById = {
		...state.runById,
	};
	const nextSlotById = {
		...state.slotById,
	};

	delete nextRunById[runId];

	for (const slotId of run.orderedSlotIds) {
		delete nextSlotById[slotId];
	}

	return {
		runIds: state.runIds.filter((value) => value !== runId),
		runById: nextRunById,
		slotById: nextSlotById,
	};
};
