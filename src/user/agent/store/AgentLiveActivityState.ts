import type { ResponseReasoningItem } from "openai/resources/responses/responses";

export namespace AgentLiveActivityState {
	export type Kind = "idle" | "pending" | "thinking" | "tool";
	export type ReasoningStatus = NonNullable<ResponseReasoningItem["status"]>;

	export interface Value {
		kind: Kind;
		reasoningStatusByItemId: Record<string, ReasoningStatus>;
	}
}
