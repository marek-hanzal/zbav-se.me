import { z } from "zod";
import { FieldTableSchema } from "~/server/database/@table/FieldTableSchema";

export const FieldCreateSchema = z
	.looseObject({
		...FieldTableSchema.shape,
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
