import { z } from "zod";
import { ResourceBundleLimitTableSchema } from "~/server/database/@table/ResourceBundleLimitTableSchema";

export const ResourceBundleLimitSchema = z
	.looseObject({
		...ResourceBundleLimitTableSchema.shape,
	})
	.strip();

export type ResourceBundleLimitSchema = typeof ResourceBundleLimitSchema;

export namespace ResourceBundleLimitSchema {
	export type Type = z.infer<ResourceBundleLimitSchema>;
}
