import { z } from "zod";
import { ResourceBundleLimitTableSchema } from "~/database/schema/ResourceBundleLimitTableSchema";

export const ResourceBundleLimitSchema = z
	.looseObject({
		...ResourceBundleLimitTableSchema.shape,
	})
	.strip();

export type ResourceBundleLimitSchema = typeof ResourceBundleLimitSchema;

export namespace ResourceBundleLimitSchema {
	export type Type = z.infer<ResourceBundleLimitSchema>;
}
