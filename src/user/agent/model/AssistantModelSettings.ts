import type { ModelSettings } from "@openai/agents-core";

export const AssistantModelSettings: ModelSettings = {
	frequencyPenalty: 1.15,
	temperature: 0.75,
	reasoning: {
		effort: "medium",
	},
};
