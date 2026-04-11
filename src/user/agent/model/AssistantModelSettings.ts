import type { ModelSettings } from "@openai/agents-core";

export const AssistantModelSettings: ModelSettings = {
	temperature: 0.25,
	reasoning: {
		effort: "high",
	},
};
