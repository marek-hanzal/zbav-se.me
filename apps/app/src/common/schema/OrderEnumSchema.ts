import { z } from "@hono/zod-openapi";

export const OrderEnumSchema = z
	.enum([
		"asc",
		"desc",
	])
	.openapi("OrderEnum", {
		description: "Order",
	});

export type OrderEnumSchema = typeof OrderEnumSchema;

export namespace OrderEnumSchema {
	export type Type = z.infer<OrderEnumSchema>;
}
