import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { FieldTypeEnumSchema } from "./FieldTypeEnumSchema";

export const FieldFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		name: z.string().optional().meta({
			description: "Exact field name",
		}),
		type: FieldTypeEnumSchema.optional().meta({
			description: "Exact field type",
		}),
		required: z.boolean().optional().meta({
			description: "Field required flag",
		}),
	})
	.strip()
	.meta({
		id: "FieldFilter",
		description: "Filter object for field collection",
	});

export type FieldFilterSchema = typeof FieldFilterSchema;

export namespace FieldFilterSchema {
	export type Type = z.infer<FieldFilterSchema>;
}
