import { z } from "zod";

export const ResourceBundleTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle",
		}),
		name: z.string().meta({
			description: "Resource bundle name",
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
