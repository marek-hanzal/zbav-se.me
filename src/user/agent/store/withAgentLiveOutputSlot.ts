import type { AgentLiveRunState } from "./AgentLiveRunState";
import type { AgentLiveSlotState } from "./AgentLiveSlotState";
import { createAgentLiveSlotState } from "./createAgentLiveSlotState";
import { getAgentLiveSlotId } from "./getAgentLiveSlotId";

export namespace withAgentLiveOutputSlot {
	export interface Result {
		run: AgentLiveRunState.Value;
		slotById: Record<string, AgentLiveSlotState.Value | undefined>;
		slot: AgentLiveSlotState.Value;
		slotId: string;
	}
}

export const withAgentLiveOutputSlot = ({
	run,
	slotById,
	runId,
	outputIndex,
	itemId,
}: {
	run: AgentLiveRunState.Value;
	slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	runId: string;
	outputIndex: number;
	itemId?: string;
}): withAgentLiveOutputSlot.Result => {
	const outputKey = String(outputIndex);
	const currentSlotId =
		run.slotIdByOutputIndex[outputKey] ??
		getAgentLiveSlotId({
			runId,
			outputIndex,
		});
	const currentSlot = slotById[currentSlotId];
	let nextRun = run;
	let nextSlotById = slotById;
	let nextSlot = currentSlot;

	if (!currentSlot) {
		nextSlot = createAgentLiveSlotState({
			slotId: currentSlotId,
			runId,
			outputIndex,
			itemId,
		});
		nextSlotById = {
			...slotById,
			[currentSlotId]: nextSlot,
		};
		nextRun = {
			...run,
			orderedSlotIds: [
				...run.orderedSlotIds,
				currentSlotId,
			].sort((left, right) => {
				return (
					(nextSlotById[left]?.outputIndex ?? 0) - (nextSlotById[right]?.outputIndex ?? 0)
				);
			}),
			slotIdByOutputIndex: {
				...run.slotIdByOutputIndex,
				[outputKey]: currentSlotId,
			},
		};

		if (itemId) {
			nextRun = {
				...nextRun,
				slotIdByItemId: {
					...nextRun.slotIdByItemId,
					[itemId]: currentSlotId,
				},
			};
		}
	}

	if (!nextSlot) {
		nextSlot = createAgentLiveSlotState({
			slotId: currentSlotId,
			runId,
			outputIndex,
			itemId,
		});
	}

	if (itemId && nextSlot.itemId !== itemId) {
		nextSlot = {
			...nextSlot,
			itemId,
		};
		nextSlotById =
			nextSlotById === slotById
				? {
						...slotById,
						[currentSlotId]: nextSlot,
					}
				: {
						...nextSlotById,
						[currentSlotId]: nextSlot,
					};

		const nextSlotIdByItemId = {
			...nextRun.slotIdByItemId,
		};

		if (currentSlot?.itemId && currentSlot.itemId !== itemId) {
			delete nextSlotIdByItemId[currentSlot.itemId];
		}

		nextSlotIdByItemId[itemId] = currentSlotId;
		nextRun = {
			...nextRun,
			slotIdByItemId: nextSlotIdByItemId,
		};
	}

	return {
		run: nextRun,
		slotById: nextSlotById,
		slot: nextSlot,
		slotId: currentSlotId,
	};
};
