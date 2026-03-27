import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const IgnoreSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "IgnoreSortField",
				description: "Field of the ignore sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "IgnoreSort",
		description: "Sort object for ignore collection",
	});

export type IgnoreSortSchema = typeof IgnoreSortSchema;

export namespace IgnoreSortSchema {
	export type Type = z.infer<IgnoreSortSchema>;
}
