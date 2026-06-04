import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleLimitTableSchema } from "~/server/database/@table/ResourceBundleLimitTableSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

type ResourceBundleLimitSeed = Pick<
	ResourceBundleLimitTableSchema.Type,
	"resourceDefinitionId" | "limit"
> & {
	resourceBundleName: ResourceBundleEnumSchema.Type;
};

export const resourceBundleLimitSeedData: ResourceBundleLimitSeed[] = [
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["listing.count"],
		limit: 50,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["feed.count"],
		limit: 15,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["extra:founders.promo"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["listing.gallery.count"],
		limit: 20,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["package:buyer"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["feed.count"],
		limit: 15,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["listing.count"],
		limit: 5,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["feed.count"],
		limit: 3,
	},
	{
		resourceBundleName: ResourceBundleEnumSchema.enum["package:free"],
		resourceDefinitionId: ResourceDefinitionEnumSchema.enum["listing.gallery.count"],
		limit: 5,
	},
];
