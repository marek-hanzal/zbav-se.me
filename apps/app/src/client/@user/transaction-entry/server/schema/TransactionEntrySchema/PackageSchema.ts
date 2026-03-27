import { z } from "zod";
import { TransactionEntryDirectionEnumSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import { PackageSchema as BasePackageSchema } from "~/server/database/@table/TransactionEntryTableSchema/PackageSchema";

export const TransactionEntryPackage = z
	.looseObject({
		...BasePackageSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
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
