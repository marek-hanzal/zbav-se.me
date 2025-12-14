import { z } from "@hono/zod-openapi";

export const OrderSchema = z
	.enum([
		"asc",
		"desc",
	])
	.openapi("Order", {
		description: "Order",
	});

export type OrderSchema = typeof OrderSchema;

export namespace OrderSchema {
	export type Type = z.infer<OrderSchema>;
}
