import { z } from "zod";

export const ResourceLimitInfoSchema = z
	.looseObject({
		count: z.number().nonnegative(),
		limit: z.number().nonnegative(),
		remaining: z.number(),
		isAvailable: z.boolean(),
	})
	.strip();

export type ResourceLimitInfoSchema = typeof ResourceLimitInfoSchema;

export namespace ResourceLimitInfoSchema {
	export type Type = z.infer<ResourceLimitInfoSchema>;
}
