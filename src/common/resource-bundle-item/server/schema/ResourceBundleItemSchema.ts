import { z } from "zod";
import { ResourceBundleItemTableSchema } from "~/server/database/@table/ResourceBundleItemTableSchema";

export const ResourceBundleItemSchema = z
	.looseObject({
		...ResourceBundleItemTableSchema.shape,
	})
	.strip();

export type ResourceBundleItemSchema = typeof ResourceBundleItemSchema;

export namespace ResourceBundleItemSchema {
	export type Type = z.infer<ResourceBundleItemSchema>;
}
