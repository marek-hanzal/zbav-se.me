import type {
	ResponseOutputItemAddedEvent,
	ResponseOutputItemDoneEvent,
} from "openai/resources/responses/responses";
import type { AgentLiveRunState } from "./AgentLiveRunState";
import type { AgentLiveSlotState } from "./AgentLiveSlotState";
import { isAgentLiveReasoningItem } from "./isAgentLiveReasoningItem";
import { withAgentLiveActivity } from "./withAgentLiveActivity";
import { withAgentLiveOutputSlot } from "./withAgentLiveOutputSlot";
import { withMergedAgentLiveItem } from "./withMergedAgentLiveItem";

export namespace withAgentLiveOutputItemEvent {
	export interface Result {
		run: AgentLiveRunState.Value;
		slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	}
}

export const withAgentLiveOutputItemEvent = ({
	run,
	slotById,
	runId,
	event,
}: {
	run: AgentLiveRunState.Value;
	slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	runId: string;
	event: ResponseOutputItemAddedEvent | ResponseOutputItemDoneEvent;
}): withAgentLiveOutputItemEvent.Result => {
	if (isAgentLiveReasoningItem(event.item)) {
		const reasoningItemId = event.item.id ?? `reasoning-${event.output_index}`;
		const nextRun = withAgentLiveActivity({
			run: {
				...run,
				activity: {
					...run.activity,
					reasoningStatusByItemId: {
						...run.activity.reasoningStatusByItemId,
						[reasoningItemId]: event.item.status ?? "in_progress",
					},
				},
			},
			slotById,
		});

		return {
			run: nextRun,
			slotById,
		};
	}

	const ensured = withAgentLiveOutputSlot({
		run,
		slotById,
		runId,
		outputIndex: event.output_index,
		itemId: event.item.id,
	});
	const nextSlot = {
		...ensured.slot,
		itemId: event.item.id ?? ensured.slot.itemId,
		item: withMergedAgentLiveItem({
			current: ensured.slot.item,
			next: event.item,
		}),
	};
	const nextSlotById = {
		...ensured.slotById,
		[ensured.slotId]: nextSlot,
	};
	const nextRun = withAgentLiveActivity({
		run: ensured.run,
		slotById: nextSlotById,
	});

	return {
		run: nextRun,
		slotById: nextSlotById,
	};
};
