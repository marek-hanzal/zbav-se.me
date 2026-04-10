import type {
	ResponseOutputItem,
	ResponseReasoningItem,
} from "openai/resources/responses/responses";

export namespace AgentLiveVisualItem {
	export type Value = Exclude<ResponseOutputItem, ResponseReasoningItem>;
}
