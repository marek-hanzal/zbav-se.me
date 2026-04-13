import type { ModelSettings } from "@openai/agents-core";

export const AssistantModelSettings: ModelSettings = {
	temperature: 0.2,
	reasoning: {
		effort: "high",
	},
};
