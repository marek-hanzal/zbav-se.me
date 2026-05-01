import { z } from "zod";
import { FieldOptionTableSchema } from "./FieldOptionTableSchema";

export const FieldOptionSchema = z
	.looseObject({
		...FieldOptionTableSchema.shape,
	})
	.strip()
	.meta({
		id: "FieldOption",
		description: "Field option data",
	});

export type FieldOptionSchema = typeof FieldOptionSchema;

export namespace FieldOptionSchema {
	export type Type = z.infer<FieldOptionSchema>;
}
