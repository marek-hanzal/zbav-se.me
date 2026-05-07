import type { FunctionCallResultItem } from "@openai/agents";

function stringifyToolOutput(value: unknown): string | undefined {
	if (typeof value === "string") {
		return value;
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (!value) {
		return undefined;
	}

	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}

export function getToolOutputText(result: FunctionCallResultItem | undefined) {
	if (!result) {
		return undefined;
	}

	const { output } = result;

	if (typeof output === "string") {
		return output;
	}

	if (Array.isArray(output)) {
		return output
			.map((item) => {
				if (item.type === "input_text") {
					return item.text;
				}

				return stringifyToolOutput(item);
			})
			.filter((item): item is string => item !== undefined && item.length > 0)
			.join("\n");
	}

	if (output.type === "text") {
		return output.text;
	}

	return stringifyToolOutput(output);
}
