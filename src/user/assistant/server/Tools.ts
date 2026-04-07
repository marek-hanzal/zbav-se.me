import type { InferUITools, ToolSet } from "ai";
// import { toolListingCollection as toolBuyerListingCollection } from "~/buyer/listing/server/tool/toolListingCollection";
// import { toolListingCount as toolBuyerListingCount } from "~/buyer/listing/server/tool/toolListingCount";
// import { toolListingCollection as toolSellerListingCollection } from "~/seller/listing/server/tool/toolListingCollection";
// import { toolListingCount as toolSellerListingCount } from "~/seller/listing/server/tool/toolListingCount";
import { toolExpertKnowledge } from "~/user/knowledge/tool/toolExpertKnowledge";

export const Tools = {
	// "knowledge-index": toolKnowledgeIndex,
	// "knowledge-search": toolKnowledgeSearch,
	// knowledge: toolKnowledge,
	//
	// "draft-collection": toolDraftCollection,
	// "draft-fetch": toolDraftFetch,
	// "draft-create": toolDraftCreate,
	// "draft-patch": toolDraftPatch,
	// "draft-delete": toolDraftDelete,
	// "draft-count": toolDraftCount,
	//
	// "seller-listing-collection": toolSellerListingCollection,
	// "seller-listing-count": toolSellerListingCount,
	// "buyer-listing-collection": toolBuyerListingCollection,
	// "buyer-listing-count": toolBuyerListingCount,
	//
	// "location-autocomplete": toolLocationAutocomplete,
	//
	// "category-collection": toolCategoryCollection,
	// "category-fetch": toolCategoryFetch,
	//
	/**
	 * Experimental RAG for accessing knowledge about the app.
	 */
	"expert-knowledge": toolExpertKnowledge,
} as const satisfies ToolSet;

export namespace Tools {
	export type Type = typeof Tools;

	export type Ui = InferUITools<Type>;
}
