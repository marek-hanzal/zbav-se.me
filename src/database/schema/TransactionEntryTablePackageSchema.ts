import { z } from "zod";
import { EntrySchema } from "~/database/schema/TransactionEntryTableEntrySchema";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";

export const PackageSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"package",
		]),
		payload: z
			.looseObject({
				link: z.url().meta({
					description: "Package tracking link",
				}),
				number: z.string().nullable().meta({
					description: "Package tracking number",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryPackage",
		description: "Transaction entry package payload",
	});

export type PackageSchema = typeof PackageSchema;

export namespace PackageSchema {
	export type Type = z.infer<PackageSchema>;
}
