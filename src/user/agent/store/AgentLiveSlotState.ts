import type { AgentLiveVisualItem } from "./AgentLiveVisualItem";

export namespace AgentLiveSlotState {
	export interface Value {
		slotId: string;
		runId: string;
		outputIndex: number;
		itemId?: string;
		item?: AgentLiveVisualItem.Value;
	}
}
