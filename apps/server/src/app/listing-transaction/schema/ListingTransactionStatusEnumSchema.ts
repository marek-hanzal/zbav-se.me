import { z } from "@hono/zod-openapi";

export const ListingTransactionStatusEnumSchema = z
	.enum([
		"request",
		"accepted",
		"rejected",
		"success",
		"closed",
		"expired",
	])
	.openapi("ListingTransactionStatusEnum", {
		description: "Current status of the listing transaction",
	});

export type ListingTransactionStatusEnumSchema = typeof ListingTransactionStatusEnumSchema;

export namespace ListingTransactionStatusEnumSchema {
	export type Type = z.infer<ListingTransactionStatusEnumSchema>;
}
