import { z } from "zod";
import { FieldTableSchema } from "./FieldTableSchema";

export const FieldSchema = z
	.looseObject({
		...FieldTableSchema.shape,
	})
	.omit({
		// No system columns to omit for field
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
