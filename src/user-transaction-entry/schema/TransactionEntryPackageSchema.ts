import { z } from "zod";
import { PackageSchema as BasePackageSchema } from "~/database/schema/TransactionEntryTablePackageSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user-transaction-entry/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryPackage = z
	.looseObject({
		...BasePackageSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryPackage",
		description: "Transaction package entry with shipment tracking payload",
	});

export type TransactionEntryPackage = typeof TransactionEntryPackage;

export namespace TransactionEntryPackage {
	export type Type = z.infer<TransactionEntryPackage>;
}
