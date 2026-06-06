import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleItemTableSchema } from "~/server/database/@table/ResourceBundleItemTableSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

type ResourceBundleItemSeed = Pick<
	ResourceBundleItemTableSchema.Type,
	"resourceBundleId" | "resourceDefinitionId" | "amount" | "expiration"
>;

export const resourceBundleItemSeedData = [
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:buyer"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token-small"],
		amount: 1,
		expiration: null,
	},
] satisfies ResourceBundleItemSeed[];
