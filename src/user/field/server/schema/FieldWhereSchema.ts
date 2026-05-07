import { z } from "zod";
import { FieldFilterSchema } from "./FieldFilterSchema";

export const FieldWhereSchema = z
	.looseObject({
		...FieldFilterSchema.shape,
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
