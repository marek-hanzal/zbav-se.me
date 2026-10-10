import { z } from "zod";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";
import { EntrySchema } from "~/user-transaction-entry/schema/TransactionEntryCreateEntrySchema";

export const LocationSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"location",
		]),
		payload: z
			.looseObject({
				locationId: z.string().meta({
					description: "Location identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryLocationCreate",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
