import { z } from "@hono/zod-openapi";

export const TransactionEntryPackageValueSchema = z
	.looseObject({
		link: z.url().openapi({
			description: "Package tracking link",
		}),
		number: z.string().nullable().openapi({
			description: "Package tracking number",
		}),
	})
	.openapi("TransactionEntryPackageValue");

export type TransactionEntryPackageValueSchema = typeof TransactionEntryPackageValueSchema;

export namespace TransactionEntryPackageValueSchema {
	export type Type = z.infer<TransactionEntryPackageValueSchema>;
}
