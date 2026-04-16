import { z } from "zod";

export const TransactionEntryKindEnumSchema = z
	.enum([
		"text",
		"gallery",
		"location",
		"package",
		"personal",
		"status-interest",
		"status-trade",
		"status-resolved",
		"status-dispute-buyer",
		"status-dispute-seller",
		"status-rejected-buyer",
		"status-rejected-seller",
		"status-sold",
		"status-expired",
		"status-success",
		"status-closed",
	])
	.meta({
		id: "TransactionEntryKindEnum",
		description: "Type of transaction timeline entry",
	});

export type TransactionEntryKindEnumSchema = typeof TransactionEntryKindEnumSchema;

export namespace TransactionEntryKindEnumSchema {
	export type Type = z.infer<TransactionEntryKindEnumSchema>;
}
