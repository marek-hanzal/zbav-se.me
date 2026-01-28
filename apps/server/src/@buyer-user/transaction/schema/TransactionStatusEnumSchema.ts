import { z } from "@hono/zod-openapi";

export const TransactionStatusEnumSchema = z
	.enum([
		/**
		 * Initial states
		 */

		// New, fresh transaction
		"pending",

		/**
		 * Running (open) states
		 */

		// Accepted (running) transaction; all the stuff happens here
		"open",
		// Resolved by seller (only) - e.g. package sent
		"resolved",
		// Running, but switched to dispute mode (e.g. buyer has a complaint)
		"dispute",

		/**
		 * Terminal states
		 */

		// Explicitly closed transaction by seller or buyer
		"rejected",
		// Expired transaction is "unknown" state (no action received from either side)
		"expired",
		// Probably rare one - submitted by buyer he's happy with the result
		"success",
		// Explicitly closed with "no emotions"
		"closed",
	])
	.openapi("TransactionStatusEnum", {
		description: "Current status of the listing transaction",
	});

export type TransactionStatusEnumSchema = typeof TransactionStatusEnumSchema;

export namespace TransactionStatusEnumSchema {
	export type Type = z.infer<TransactionStatusEnumSchema>;
}
