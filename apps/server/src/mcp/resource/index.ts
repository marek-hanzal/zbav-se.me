import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { resourceBuyerListingCollectionOutputSchema } from "~/mcp/buyer/tool/listing-collection/resourceBuyerListingCollectionOutputSchema";
import { resourceBuyerListingFetchOutputSchema } from "~/mcp/buyer/tool/listing-fetch/resourceBuyerListingFetchOutputSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { resourceGuideOverview } from "~/mcp/resource/guide/resourceGuideOverview";
import { resourceGuideRules } from "~/mcp/resource/guide/resourceGuideRules";
import { withResourceMcpHealth } from "~/mcp/resource/resourceMcpHealth";
import { withResourceMcpTools } from "~/mcp/resource/resourceMcpTools";
import type { ServerInfo } from "~/mcp/serverInfo";
import { mcpTools } from "~/mcp/tool";

interface WithMcpResourcesProps {
	serverInfo: ServerInfo;
}

export const withMcpResources = ({
	serverInfo,
}: WithMcpResourcesProps): McpResourceDefinition.Definition[] => {
	return [
		withResourceMcpHealth({
			serverInfo,
			tools: mcpTools,
		}),
		withResourceMcpTools({
			tools: mcpTools,
		}),
		resourceGuideOverview,
		resourceGuideRules,
		resourceListingSchema,
		resourceBuyerListingFetchOutputSchema,
		resourceBuyerListingCollectionOutputSchema,
	];
};
