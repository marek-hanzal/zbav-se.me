import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const FlagWhereSchema = z
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
		id: "FlagWhere",
		description: "App-based filters",
	});

export type FlagWhereSchema = typeof FlagWhereSchema;

export namespace FlagWhereSchema {
	export type Type = z.infer<FlagWhereSchema>;
}
