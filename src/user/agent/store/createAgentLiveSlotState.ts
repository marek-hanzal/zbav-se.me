import type { AgentLiveSlotState } from "./AgentLiveSlotState";

export const createAgentLiveSlotState = ({
	slotId,
	runId,
	outputIndex,
	itemId,
}: {
	slotId: string;
	runId: string;
	outputIndex: number;
	itemId?: string;
}): AgentLiveSlotState.Value => {
	return {
		slotId,
		runId,
		outputIndex,
		itemId,
	};
};
