import type { ModelSettings } from "@openai/agents-core/model";

export const ToolModelSettings: ModelSettings = {
	temperature: 0,
	parallelToolCalls: true,
	reasoning: {
		effort: "medium",
	},
};
