import type { AgentLiveActivityState } from "./AgentLiveActivityState";

export namespace AgentLiveRunState {
	export type Status = "streaming" | "completed" | "cancelled" | "failed" | "incomplete";
	export type Notice = Exclude<Status, "streaming" | "completed">;

	export interface Value {
		runId: string;
		userText: string;
		orderedSlotIds: string[];
		slotIdByOutputIndex: Record<string, string>;
		slotIdByItemId: Record<string, string>;
		status: Status;
		responseId?: string;
		activity: AgentLiveActivityState.Value;
		notice?: Notice;
	}
}
