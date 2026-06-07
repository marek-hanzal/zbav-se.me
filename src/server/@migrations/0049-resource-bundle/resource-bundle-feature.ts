import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

interface ResourceBundleFeatureSeed {
	resourceBundleId: ResourceBundleEnumSchema.Type;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
}

export const resourceBundleFeatureSeedData: ResourceBundleFeatureSeed[] = [
	/**
	 * Buyer features
	 */
	{
		resourceBundleId: "package:buyer",
		resourceDefinitionId: "buyer:feature:listing.early-discovery",
	},
	{
		resourceBundleId: "package:buyer",
		resourceDefinitionId: "buyer:feature:seller.info",
	},
	/**
	 * Seller features
	 */
	{
		resourceBundleId: "package:seller",
		resourceDefinitionId: "seller:feature:buyer.info",
	},
];
