import { z } from "zod";

export const OrderSchema = z.union([
	z.enum([
		"asc",
		"desc",
	]),
	z.null(),
]);

export type OrderSchema = typeof OrderSchema;

export namespace OrderSchema {
	export type Type = z.infer<OrderSchema>;
}
