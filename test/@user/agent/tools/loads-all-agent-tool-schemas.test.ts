import { describe, expect, test } from "vitest";
import { AssistantAgent } from "~/user-agent/service/AssistantAgent";

describe("AssistantAgent tool schemas", () => {
	test("loads every registered tool with an object parameter schema", () => {
		expect(AssistantAgent.tools.length).toBeGreaterThan(0);

		for (const agentTool of AssistantAgent.tools) {
			expect(agentTool.type).toBe("function");
			if (agentTool.type !== "function") {
				throw new Error("Expected a function tool");
			}

			expect(agentTool.parameters, agentTool.name).toMatchObject({
				type: "object",
				additionalProperties: false,
			});
		}
	});
});
