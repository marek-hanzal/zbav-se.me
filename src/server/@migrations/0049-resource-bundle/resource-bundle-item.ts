import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

interface ResourceBundleItemSeed {
	resourceBundleId: ResourceBundleEnumSchema.Type;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	amount: number;
	expiration: number | null;
}

export const resourceBundleItemSeedData: ResourceBundleItemSeed[] = [
	/**
	 * Buyer items
	 */
	{
		resourceBundleId: "package:buyer",
		resourceDefinitionId: "common:item:token-small",
		amount: 150,
		expiration: null,
	},
	/**
	 * Seller items
	 */
	{
		resourceBundleId: "package:seller",
		resourceDefinitionId: "common:item:token-small",
		amount: 150,
		expiration: null,
	},
	{
        /**
         * This is intentionall: seller package has limited usage of early-delivery to just only a few listings.
         */
		resourceBundleId: "package:seller",
		resourceDefinitionId: "seller:item:listing.early-delivery",
		amount: 5,
		expiration: null,
	},
];
