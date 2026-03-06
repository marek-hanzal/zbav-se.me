import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { resourceBuyerListingCollectionOutputSchema } from "~/mcp/buyer/tool/listing-collection/resourceBuyerListingCollectionOutputSchema";
import { resourceBuyerListingFetchOutputSchema } from "~/mcp/buyer/tool/listing-fetch/resourceBuyerListingFetchOutputSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { resourceEntityCategory } from "~/mcp/resource/entity/resourceEntityCategory";
import { resourceEntityDraft } from "~/mcp/resource/entity/resourceEntityDraft";
import { resourceEntityGallery } from "~/mcp/resource/entity/resourceEntityGallery";
import { resourceEntityListing } from "~/mcp/resource/entity/resourceEntityListing";
import { resourceEntityLocation } from "~/mcp/resource/entity/resourceEntityLocation";
import { resourceGuideListingBehavior } from "~/mcp/resource/guide/resourceGuideListingBehavior";
import { resourceGuideOverview } from "~/mcp/resource/guide/resourceGuideOverview";
import { resourceGuideRoles } from "~/mcp/resource/guide/resourceGuideRoles";
import { resourceGuideRules } from "~/mcp/resource/guide/resourceGuideRules";
import { withResourceMcpHealth } from "~/mcp/resource/resourceMcpHealth";
import { withResourceMcpTools } from "~/mcp/resource/resourceMcpTools";
import { resourceEnumCurrency } from "~/mcp/resource/schema/enum/resourceEnumCurrency";
import { resourceEnumListingDelivery } from "~/mcp/resource/schema/enum/resourceEnumListingDelivery";
import { resourceEnumListingPrice } from "~/mcp/resource/schema/enum/resourceEnumListingPrice";
import { resourceEnumListingRestriction } from "~/mcp/resource/schema/enum/resourceEnumListingRestriction";
import { resourceEnumListingSort } from "~/mcp/resource/schema/enum/resourceEnumListingSort";
import { resourceEnumListingWarranty } from "~/mcp/resource/schema/enum/resourceEnumListingWarranty";
import { resourceEnumThumb } from "~/mcp/resource/schema/enum/resourceEnumThumb";
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
		resourceGuideRoles,
		resourceGuideListingBehavior,
		resourceEntityListing,
		resourceEntityDraft,
		resourceEntityGallery,
		resourceEntityLocation,
		resourceEntityCategory,
		resourceListingSchema,
		resourceBuyerListingFetchOutputSchema,
		resourceBuyerListingCollectionOutputSchema,
		resourceEnumListingRestriction,
		resourceEnumCurrency,
		resourceEnumListingPrice,
		resourceEnumListingWarranty,
		resourceEnumListingDelivery,
		resourceEnumThumb,
		resourceEnumListingSort,
	];
};
