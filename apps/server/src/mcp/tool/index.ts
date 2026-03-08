import type { z } from "zod";
import { toolListingCollection } from "~/mcp/buyer/tool/listing-collection/toolListingCollection";
import { toolListingFetch } from "~/mcp/buyer/tool/listing-fetch/toolListingFetch";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { toolDraftCollection } from "~/mcp/seller/tool/draft-collection/toolDraftCollection";
import { toolDraftCount } from "~/mcp/seller/tool/draft-count/toolDraftCount";
import { toolDraftCreate } from "~/mcp/seller/tool/draft-create/toolDraftCreate";
import { toolDraftFetch } from "~/mcp/seller/tool/draft-fetch/toolDraftFetch";
import { toolDraftGalleryCreate } from "~/mcp/seller/tool/draft-gallery-create/toolDraftGalleryCreate";
import { toolDraftPatch } from "~/mcp/seller/tool/draft-patch/toolDraftPatch";
import { toolSellerListingCount } from "~/mcp/seller/tool/listing-count/toolSellerListingCount";
import { toolSellerListingCreate } from "~/mcp/seller/tool/listing-create/toolSellerListingCreate";
import { toolCategoryCollection } from "~/mcp/session/tool/category-collection/toolCategoryCollection";
import { toolLocationAutocomplete } from "~/mcp/session/tool/location-autocomplete/toolLocationAutocomplete";
import { toolS3PreSign } from "~/mcp/user/tool/s3-presign/toolS3PreSign";
import { toolUploadCreate } from "~/mcp/user/tool/upload-create/toolUploadCreate";

export const mcpTools = [
	toolListingFetch,
	toolListingCollection,
	toolCategoryCollection,
	toolLocationAutocomplete,
	toolS3PreSign,
	toolUploadCreate,
	toolDraftCollection,
	toolDraftFetch,
	toolDraftCount,
	toolDraftCreate,
	toolDraftPatch,
	toolDraftGalleryCreate,
	toolSellerListingCount,
	toolSellerListingCreate,
] as const satisfies readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];
