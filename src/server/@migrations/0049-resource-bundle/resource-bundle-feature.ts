import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleFeatureTableSchema } from "~/server/database/@table/ResourceBundleFeatureTableSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

type ResourceBundleFeatureSeed = Pick<
	ResourceBundleFeatureTableSchema.Type,
	"resourceBundleId" | "resourceDefinitionId"
>;

export const resourceBundleFeatureSeedData = [
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:buyer"],
		resourceDefinitionId:
			ResourceDefinitionEnumSchema.enum["buyer:feature:listing.early-discovery"],
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:seller"],
		resourceDefinitionId:
			ResourceDefinitionEnumSchema.enum["seller:feature:listing.early-delivery"],
	},
] satisfies ResourceBundleFeatureSeed[];
