import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const FlagFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.openapi("FlagFilter", {
		description: "Filter object for flag collection",
	});

export type FlagFilterSchema = typeof FlagFilterSchema;

export namespace FlagFilterSchema {
	export type Type = z.infer<FlagFilterSchema>;
}
