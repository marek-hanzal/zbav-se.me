import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const FieldOptionWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		fieldId: z.string().optional().meta({
			description: "Exact field id",
		}),
		value: z.string().optional().meta({
			description: "Exact option value",
		}),
		sort: z.number().int().nonnegative().optional().meta({
			description: "Option sort order",
		}),
	})
	.strip()
	.meta({
		id: "FieldOptionWhere",
		description: "App-based filters",
	});

export type FieldOptionWhereSchema = typeof FieldOptionWhereSchema;

export namespace FieldOptionWhereSchema {
	export type Type = z.infer<FieldOptionWhereSchema>;
}
