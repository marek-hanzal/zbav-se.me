import { z } from "zod";
import { FieldTableSchema } from "~/server/database/@table/FieldTableSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

export const FieldSchema = z
	.looseObject({
		...FieldTableSchema.shape,
        options: z.array(FieldOptionSchema),
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
