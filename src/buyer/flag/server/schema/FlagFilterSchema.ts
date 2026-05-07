import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const FlagFilterSchema = z
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
		id: "FlagFilter",
		description: "Filter object for flag collection",
	});

export type FlagFilterSchema = typeof FlagFilterSchema;

export namespace FlagFilterSchema {
	export type Type = z.infer<FlagFilterSchema>;
}
