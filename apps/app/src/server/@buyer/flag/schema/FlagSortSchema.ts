import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const FlagSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "FlagSortField",
				description: "Field of the flag sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "FlagSort",
		description: "Sort object for flag collection",
	});

export type FlagSortSchema = typeof FlagSortSchema;

export namespace FlagSortSchema {
	export type Type = z.infer<FlagSortSchema>;
}
