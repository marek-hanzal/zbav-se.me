import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { resourceBuyerListingCollectionOutputSchema } from "~/mcp/buyer/tool/listing-collection/resourceBuyerListingCollectionOutputSchema";
import { resourceBuyerListingFetchOutputSchema } from "~/mcp/buyer/tool/listing-fetch/resourceBuyerListingFetchOutputSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { withResourceMcpCatalogs } from "~/mcp/resource/resourceMcpCatalogs";
import { withResourceMcpHealth } from "~/mcp/resource/resourceMcpHealth";
import { withResourceMcpTools } from "~/mcp/resource/resourceMcpTools";
import {
	withStaticEntityResourceTemplate,
	withStaticEnumResourceTemplate,
	withStaticFieldResourceTemplate,
	withStaticProfileResourceTemplate,
	withStaticResources,
} from "~/mcp/resource/static";
import { resourceDraftSchema } from "~/mcp/seller/resource/resourceDraftSchema";
import { resourceSellerListingSchema } from "~/mcp/seller/resource/resourceSellerListingSchema";
import { resourceSellerDraftCollectionOutputSchema } from "~/mcp/seller/tool/draft-collection/resourceSellerDraftCollectionOutputSchema";
import { resourceSellerDraftCountOutputSchema } from "~/mcp/seller/tool/draft-count/resourceSellerDraftCountOutputSchema";
import { resourceSellerDraftCreateOutputSchema } from "~/mcp/seller/tool/draft-create/resourceSellerDraftCreateOutputSchema";
import { resourceSellerDraftFetchOutputSchema } from "~/mcp/seller/tool/draft-fetch/resourceSellerDraftFetchOutputSchema";
import { resourceSellerDraftGalleryCreateOutputSchema } from "~/mcp/seller/tool/draft-gallery-create/resourceSellerDraftGalleryCreateOutputSchema";
import { resourceSellerDraftPatchOutputSchema } from "~/mcp/seller/tool/draft-patch/resourceSellerDraftPatchOutputSchema";
import { resourceSellerListingCountOutputSchema } from "~/mcp/seller/tool/listing-count/resourceSellerListingCountOutputSchema";
import { resourceSellerListingCreateOutputSchema } from "~/mcp/seller/tool/listing-create/resourceSellerListingCreateOutputSchema";
import { resourceCategorySchema } from "~/mcp/session/resource/resourceCategorySchema";
import { resourceSessionCategoryCollectionOutputSchema } from "~/mcp/session/tool/category-collection/resourceSessionCategoryCollectionOutputSchema";
import { resourceLocationSchema } from "~/mcp/session/resource/resourceLocationSchema";
import { resourceSessionLocationAutocompleteOutputSchema } from "~/mcp/session/tool/location-autocomplete/resourceSessionLocationAutocompleteOutputSchema";
import { resourceGallerySchema } from "~/mcp/user/resource/resourceGallerySchema";
import { resourceUploadSchema } from "~/mcp/user/resource/resourceUploadSchema";
import { resourceUserS3PreSignOutputSchema } from "~/mcp/user/tool/s3-presign/resourceUserS3PreSignOutputSchema";
import { resourceUserUploadCreateOutputSchema } from "~/mcp/user/tool/upload-create/resourceUserUploadCreateOutputSchema";
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
	const resources: McpResourceDefinition.Definition[] = [
		withResourceMcpHealth({
			serverInfo,
			tools: mcpTools,
		}),
		withResourceMcpTools({
			tools: mcpTools,
		}),
		...withStaticResources(),
		resourceListingSchema,
		resourceDraftSchema,
		resourceSellerListingSchema,
		resourceSellerDraftCollectionOutputSchema,
		resourceSellerDraftFetchOutputSchema,
		resourceSellerDraftCountOutputSchema,
		resourceCategorySchema,
		resourceLocationSchema,
		resourceUploadSchema,
		resourceGallerySchema,
		resourceBuyerListingFetchOutputSchema,
		resourceBuyerListingCollectionOutputSchema,
		resourceSessionCategoryCollectionOutputSchema,
		resourceSessionLocationAutocompleteOutputSchema,
		resourceUserS3PreSignOutputSchema,
		resourceUserUploadCreateOutputSchema,
		resourceSellerDraftCreateOutputSchema,
		resourceSellerDraftPatchOutputSchema,
		resourceSellerDraftGalleryCreateOutputSchema,
		resourceSellerListingCountOutputSchema,
		resourceSellerListingCreateOutputSchema,
	];

	const templates: McpResourceDefinition.TemplateDefinition[] = [
		withStaticFieldResourceTemplate(),
		withStaticProfileResourceTemplate(),
		withStaticEntityResourceTemplate(),
		withStaticEnumResourceTemplate(),
	];

	return {
		resources: [
			...resources,
			...withResourceMcpCatalogs({
				resources,
				templates,
				tools: mcpTools,
			}),
		],
		templates,
	};
};
