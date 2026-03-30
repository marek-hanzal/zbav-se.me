import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const IgnoreFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "IgnoreFilter",
		description: "Filter object for ignore collection",
	});

export type IgnoreFilterSchema = typeof IgnoreFilterSchema;

export namespace IgnoreFilterSchema {
	export type Type = z.infer<IgnoreFilterSchema>;
}
