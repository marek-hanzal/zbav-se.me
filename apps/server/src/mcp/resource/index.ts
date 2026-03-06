import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { resourceBuyerListingCollectionOutputSchema } from "~/mcp/buyer/tool/listing-collection/resourceBuyerListingCollectionOutputSchema";
import { resourceBuyerListingFetchOutputSchema } from "~/mcp/buyer/tool/listing-fetch/resourceBuyerListingFetchOutputSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { withResourceMcpHealth } from "~/mcp/resource/resourceMcpHealth";
import { withResourceMcpTools } from "~/mcp/resource/resourceMcpTools";
import { withStaticFieldResourceTemplate, withStaticResources } from "~/mcp/resource/static";
import type { ServerInfo } from "~/mcp/serverInfo";
import { mcpTools } from "~/mcp/tool";

interface WithMcpResourcesProps {
	serverInfo: ServerInfo;
}

export const withMcpResources = ({
	serverInfo,
}: WithMcpResourcesProps): {
	resources: McpResourceDefinition.Definition[];
	templates: McpResourceDefinition.TemplateDefinition[];
} => {
	return {
		resources: [
			withResourceMcpHealth({
				serverInfo,
				tools: mcpTools,
			}),
			withResourceMcpTools({
				tools: mcpTools,
			}),
			...withStaticResources(),
			resourceListingSchema,
			resourceBuyerListingFetchOutputSchema,
			resourceBuyerListingCollectionOutputSchema,
		],
		templates: [
			withStaticFieldResourceTemplate(),
		],
	};
};
