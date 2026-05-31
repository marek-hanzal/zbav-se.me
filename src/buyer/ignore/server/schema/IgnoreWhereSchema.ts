import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const IgnoreWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "IgnoreWhere",
		description: "App-based filters",
	});

export type IgnoreWhereSchema = typeof IgnoreWhereSchema;

export namespace IgnoreWhereSchema {
	export type Type = z.infer<IgnoreWhereSchema>;
}
