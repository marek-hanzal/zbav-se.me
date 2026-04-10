import type { FunctionCallResultItem } from "@openai/agents";

export function getToolOutputText(result: FunctionCallResultItem | undefined) {
	if (!result) {
		return undefined;
	}

	const { output } = result;

	if (typeof output === "string") {
		return output;
	}

	if (Array.isArray(output)) {
		return undefined;
	}

	if (output.type === "text") {
		return output.text;
	}

	return undefined;
}
