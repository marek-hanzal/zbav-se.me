import { z } from "zod";
import { ResourceBundleFeatureTableSchema } from "~/server/database/@table/ResourceBundleFeatureTableSchema";

export const ResourceBundleFeatureSchema = z
	.looseObject({
		...ResourceBundleFeatureTableSchema.shape,
	})
	.strip();

export type ResourceBundleFeatureSchema = typeof ResourceBundleFeatureSchema;

export namespace ResourceBundleFeatureSchema {
	export type Type = z.infer<ResourceBundleFeatureSchema>;
}
