import { z } from "@hono/zod-openapi";

export const TransactionMessagePackageCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a package message to",
		}),
		link: z.url().openapi({
			description: "Package link",
		}),
		number: z.string().nullable().openapi({
			description: "Tracking number",
		}),
	})
	.openapi("TransactionMessagePackageCreate", {
		description: "Request to create a transaction message package",
	});

export type TransactionMessagePackageCreateSchema = typeof TransactionMessagePackageCreateSchema;

export namespace TransactionMessagePackageCreateSchema {
	export type Type = z.infer<TransactionMessagePackageCreateSchema>;
}
