import { z } from "@hono/zod-openapi";

export const ListingTransactionStatusSchema = z
	.enum([
		"request",
		"accepted",
		"rejected",
		"success",
		"closed",
		"expired",
	])
	.openapi("ListingTransactionStatus", {
		description: "Current status of the listing transaction",
	});

export type ListingTransactionStatusSchema = typeof ListingTransactionStatusSchema;

export namespace ListingTransactionStatusSchema {
	export type Type = z.infer<ListingTransactionStatusSchema>;
}
