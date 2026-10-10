import { z } from "zod";

export const TransactionStatusEnumSchema = z
	.enum([
		/**
		 * Initial states
		 */

		// New, fresh transaction - buyer has expressed interest
		"interest",

		/**
		 * Running (trade) states
		 */

		// Accepted (running) transaction; all the stuff happens here
		"trade",
		// Resolved by seller (only) - e.g. package sent
		"resolved",
		// Running, but switched to dispute mode (e.g. buyer has a complaint)
		"dispute",

		/**
		 * Terminal states
		 */

		// Marked as sold outside of the standard happy-path result flow
		"sold",
		// Explicitly closed transaction by seller or buyer
		"rejected",
		// Expired transaction is "unknown" state (no action received from either side)
		"expired",
		// Probably rare one - submitted by buyer he's happy with the result
		"success",
		// Explicitly closed with "no emotions"
		"closed",
	])
	.meta({
		id: "TransactionStatusEnum",
		description: "Current status of the listing transaction",
	});

export type TransactionStatusEnumSchema = typeof TransactionStatusEnumSchema;

export namespace TransactionStatusEnumSchema {
	export type Type = z.infer<TransactionStatusEnumSchema>;
}
