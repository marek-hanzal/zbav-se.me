import type { ModelSettings } from "@openai/agents-core/model";

export const ToolModelSettings: ModelSettings = {
	frequencyPenalty: 1.15,
	temperature: 0.15,
	reasoning: {
		effort: "none",
	},
	toolChoice: "required",
};
