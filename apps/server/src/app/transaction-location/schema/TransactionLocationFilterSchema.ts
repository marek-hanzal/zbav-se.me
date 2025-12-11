import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionLocationFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		locationId: z.string().optional().openapi({
			description: "This filter matches the exact locationId",
		}),
		side: z
			.enum([
				"buyer",
				"seller",
			])
			.optional()
			.openapi({
				description: "This filter matches the exact side",
			}),
	})
	.openapi("TransactionLocationFilter", {
		description: "Filter object for transaction location",
	});

export type TransactionLocationFilterSchema = typeof TransactionLocationFilterSchema;

export namespace TransactionLocationFilterSchema {
	export type Type = z.infer<TransactionLocationFilterSchema>;
}
