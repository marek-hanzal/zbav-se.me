import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const FieldOptionSortSchema = z
	.object({
		field: z
			.enum([
				"fieldId",
				"value",
				"sort",
			])
			.meta({
				id: "FieldOptionSortField",
				description: "Field of the field-option sort",
			}),
		order: OrderEnumSchema,
	})
	.meta({
		id: "FieldOptionSort",
		description: "Sort object for field-option collection",
	});

export type FieldOptionSortSchema = typeof FieldOptionSortSchema;

export namespace FieldOptionSortSchema {
	export type Type = z.infer<FieldOptionSortSchema>;
}
