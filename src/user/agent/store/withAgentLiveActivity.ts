import type { AgentLiveRunState } from "./AgentLiveRunState";
import type { AgentLiveSlotState } from "./AgentLiveSlotState";
import { isAgentLiveSlotRenderable } from "./isAgentLiveSlotRenderable";
import { isAgentLiveToolItem } from "./isAgentLiveToolItem";

export const withAgentLiveActivity = ({
	run,
	slotById,
}: {
	run: AgentLiveRunState.Value;
	slotById: Record<string, AgentLiveSlotState.Value | undefined>;
}): AgentLiveRunState.Value => {
	if (run.status !== "streaming") {
		if (
			run.activity.kind === "idle" &&
			Object.keys(run.activity.reasoningStatusByItemId).length === 0
		) {
			return run;
		}

		return {
			...run,
			activity: {
				kind: "idle",
				reasoningStatusByItemId: {},
			},
		};
	}

	const hasTool = run.orderedSlotIds.some((slotId) => {
		const item = slotById[slotId]?.item;

		if (!item || !isAgentLiveToolItem(item) || !("status" in item)) {
			return false;
		}

		return item.status === "in_progress";
	});
	const hasReasoning = Object.values(run.activity.reasoningStatusByItemId).some((status) => {
		return status === "in_progress";
	});
	const hasRenderableOutput = run.orderedSlotIds.some((slotId) => {
		return isAgentLiveSlotRenderable(slotById[slotId]?.item);
	});
	const kind = hasTool
		? "tool"
		: hasReasoning
			? "thinking"
			: hasRenderableOutput
				? "idle"
				: "pending";

	if (kind === run.activity.kind) {
		return run;
	}

	return {
		...run,
		activity: {
			...run.activity,
			kind,
		},
	};
};
