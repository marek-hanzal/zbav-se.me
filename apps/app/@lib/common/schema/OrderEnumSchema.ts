import { z } from "zod";

export const OrderEnumSchema = z
	.enum([
		"asc",
		"desc",
	])
	.meta({
		id: "OrderEnum",
		description: "Sort order",
	});

export type OrderEnumSchema = typeof OrderEnumSchema;

export namespace OrderEnumSchema {
	export type Type = z.infer<OrderEnumSchema>;
}
