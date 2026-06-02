import type { z } from "zod";
import { TransactionEntryKindEnumSchema } from "./TransactionEntryKindEnumSchema";

export const TransactionEntrySensitiveKindEnumSchema = TransactionEntryKindEnumSchema.extract([
	"location",
	"package",
	"personal",
]).meta({
	id: "TransactionEntrySensitiveKindEnum",
	description: "Sensitive structured transaction entry kinds",
});

export type TransactionEntrySensitiveKindEnumSchema =
	typeof TransactionEntrySensitiveKindEnumSchema;

export namespace TransactionEntrySensitiveKindEnumSchema {
	export type Type = z.infer<TransactionEntrySensitiveKindEnumSchema>;
}
