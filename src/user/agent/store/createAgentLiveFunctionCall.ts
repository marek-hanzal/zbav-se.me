import type { ResponseFunctionToolCall } from "openai/resources/responses/responses";

export const createAgentLiveFunctionCall = ({
	itemId,
}: {
	itemId: string;
}): ResponseFunctionToolCall => {
	return {
		id: itemId,
		type: "function_call",
		call_id: itemId,
		name: "function",
		arguments: "",
		status: "in_progress",
	};
};
