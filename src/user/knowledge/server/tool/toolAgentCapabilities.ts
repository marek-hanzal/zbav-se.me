import { tool } from "@openai/agents";
import { z } from "zod";
import { keysOf } from "@/lib/common/keys-of";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { SellerListingAgent } from "~/seller/listing/server/tool/SellerListingAgent";
import { getRootLogger } from "~/server/log/getRootLogger";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";

const logger = getRootLogger([
	"tool",
	"toolAgentCapabilities",
]);

const Agents = {
	"seller-draft": DraftAgent,
	"seller-listing": SellerListingAgent,
	location: LocationAgent,
} as const;

const AgentKeySchema = z.enum(keysOf(Agents));

export const toolAgentCapabilities = tool({
	name: "agent-capabilities",
	needsApproval: false,
	description: `
        Read-only introspection of worker agent capabilities. Use this to answer what a worker
        can do, which inputs its tools accept, and what a user needs before a workflow starts.
        This tool never executes worker tools or mutates application data.
    `.trim(),
	parameters: z
		.looseObject({
			agent: AgentKeySchema.describe("Worker agent to inspect."),
		})
		.strip(),
	async execute({ agent }) {
		logger.trace("toolAgentCapabilities", {
			agent,
		});

		const target = Agents[agent];

		return {
			agent,
			name: target.name,
			tools: target.tools
				.filter((item) => item.type === "function")
				.map((item) => ({
					name: item.name,
					description: item.description,
					parameters: item.parameters,
					strict: item.strict,
				})),
		};
	},
});
