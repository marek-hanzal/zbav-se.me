import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const FieldSortSchema = z
	.object({
		field: z
			.enum([
				"name",
				"type",
				"required",
			])
			.meta({
				id: "FieldSortField",
				description: "Field of the field sort",
			}),
		order: OrderEnumSchema,
	})
	.meta({
		id: "FieldSort",
		description: "Sort object for field collection",
	});

export type FieldSortSchema = typeof FieldSortSchema;

export namespace FieldSortSchema {
	export type Type = z.infer<FieldSortSchema>;
}
