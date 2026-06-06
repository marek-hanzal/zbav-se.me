import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleLimitTableSchema } from "~/server/database/@table/ResourceBundleLimitTableSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const resourceBundleLimitSeedData = [
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
		limit: 50,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
		limit: 15,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId:
			ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
		limit: 20,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:buyer"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
		limit: 15,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
		limit: 5,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
		limit: 3,
	},
	{
		resourceBundleId: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId:
			ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
		limit: 5,
	},
] satisfies Pick<
	ResourceBundleLimitTableSchema.Type,
	"resourceBundleId" | "resourceDefinitionId" | "limit"
>[];
