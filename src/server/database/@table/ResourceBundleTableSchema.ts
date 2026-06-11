import { z } from "zod";
import { ResourceBundleTypeEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleTypeEnumSchema";

export const ResourceBundleTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle",
		}),
		name: z.string().meta({
			description: "Resource bundle name",
		}),
		type: ResourceBundleTypeEnumSchema.meta({
			description: "Resource bundle business type",
		}),
	})
	.meta({
		id: "ResourceBundleTable",
		description: "Database row for a resource bundle.",
	})
	.strip();

export type ResourceBundleTableSchema = typeof ResourceBundleTableSchema;

export namespace ResourceBundleTableSchema {
	export type Type = z.infer<ResourceBundleTableSchema>;
}
