import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const IgnoreFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("IgnoreFilter", {
		description: "Filter object for ignore collection",
	});

export type IgnoreFilterSchema = typeof IgnoreFilterSchema;

export namespace IgnoreFilterSchema {
	export type Type = z.infer<IgnoreFilterSchema>;
}
