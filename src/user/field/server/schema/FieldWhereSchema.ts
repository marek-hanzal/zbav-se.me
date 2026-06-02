import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { FieldTypeEnumSchema } from "./FieldTypeEnumSchema";

export const FieldWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		name: z.string().optional().meta({
			description: "Exact field name",
		}),
		type: FieldTypeEnumSchema.optional().meta({
			description: "Exact field type",
		}),
	})
	.strip()
	.meta({
		id: "FieldWhere",
		description: "App-based filters",
	});

export type FieldWhereSchema = typeof FieldWhereSchema;

export namespace FieldWhereSchema {
	export type Type = z.infer<FieldWhereSchema>;
}
