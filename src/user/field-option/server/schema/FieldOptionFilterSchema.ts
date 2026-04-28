import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const FieldOptionFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
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
		id: "FieldOptionFilter",
		description: "Filter object for field-option collection",
	});

export type FieldOptionFilterSchema = typeof FieldOptionFilterSchema;

export namespace FieldOptionFilterSchema {
	export type Type = z.infer<FieldOptionFilterSchema>;
}
