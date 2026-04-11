import type { ModelSettings } from "@openai/agents-core";

export const AssistantModelSettings: ModelSettings = {
	temperature: 0.1,
	reasoning: {
		effort: "high",
	},
	// toolChoice: "required",
};
