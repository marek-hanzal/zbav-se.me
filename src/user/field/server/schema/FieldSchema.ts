import { z } from "zod";
import { FieldTableSchema } from "~/server/database/@table/FieldTableSchema";

export const FieldSchema = z
	.looseObject({
		...FieldTableSchema.shape,
	})
	.strip()
	.meta({
		id: "Field",
		description: "Field data",
	});

export type FieldSchema = typeof FieldSchema;

export namespace FieldSchema {
	export type Type = z.infer<FieldSchema>;
}
