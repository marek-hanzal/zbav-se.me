import { z } from "zod";
import { EntrySchema } from "~/database/schema/TransactionEntryTableEntrySchema";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";

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
		id: "TransactionEntryLocation",
		description: "Transaction entry location payload",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
