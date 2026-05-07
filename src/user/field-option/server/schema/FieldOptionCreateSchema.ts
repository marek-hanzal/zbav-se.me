import { z } from "zod";
import { FieldOptionTableSchema } from "./FieldOptionTableSchema";

export const FieldOptionCreateSchema = z
	.looseObject({
		...FieldOptionTableSchema.shape,
	})
	.strip()
	.meta({
		id: "FieldOptionCreate",
		description: "Data for creating a new field option",
	});

export type FieldOptionCreateSchema = typeof FieldOptionCreateSchema;

export namespace FieldOptionCreateSchema {
	export type Type = z.infer<FieldOptionCreateSchema>;
}
