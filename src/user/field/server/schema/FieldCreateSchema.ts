import { z } from "zod";
import { FieldTableSchema } from "./FieldTableSchema";

export const FieldCreateSchema = z
	.looseObject({
		...FieldTableSchema.shape,
	})
	.omit({
		id: true,
	})
	.strip()
	.meta({
		id: "FieldCreate",
		description: "Data for creating a new field",
	});

export type FieldCreateSchema = typeof FieldCreateSchema;

export namespace FieldCreateSchema {
	export type Type = z.infer<FieldCreateSchema>;
}
