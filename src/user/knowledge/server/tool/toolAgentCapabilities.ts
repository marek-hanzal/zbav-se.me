import { tool } from "@openai/agents";
import { z } from "zod";
import { keysOf } from "@/lib/common/keys-of";
import { FeedAgent } from "~/buyer/feed/server/tool/FeedAgent";
import { FavouriteAgent } from "~/buyer/feed-favourite/server/tool/FavouriteAgent";
import { BuyerListingAgent } from "~/buyer/listing/server/tool/BuyerListingAgent";
import { BuyerTransactionAgent } from "~/buyer/transaction/server/tool/BuyerTransactionAgent";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { SellerListingAgent } from "~/seller/listing/server/tool/SellerListingAgent";
import { SellerTransactionAgent } from "~/seller/transaction/server/tool/SellerTransactionAgent";
import { getRootLogger } from "~/server/log/getRootLogger";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";
import { ActivityAgent } from "~/user/activity/server/tool/ActivityAgent";

const logger = getRootLogger([
	"tool",
	"toolAgentCapabilities",
]);

const Agents = {
	"buyer-listing": BuyerListingAgent,
	"buyer-feed": FeedAgent,
	"buyer-favourite": FavouriteAgent,
	"buyer-transaction": BuyerTransactionAgent,
	//
	"seller-draft": DraftAgent,
	"seller-listing": SellerListingAgent,
	"seller-transaction": SellerTransactionAgent,
	//
	activity: ActivityAgent,
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
