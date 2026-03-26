import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { PackageSchema as BasePackageSchema } from "~/server/database/@table/TransactionEntryTableSchema/PackageSchema";

export const TransactionEntryPackage = z
	.looseObject({
		...BasePackageSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.openapi("TransactionEntryPackage", {
		description: "Transaction package entry with shipment tracking payload",
	});

export type TransactionEntryPackage = typeof TransactionEntryPackage;

export namespace TransactionEntryPackage {
	export type Type = z.infer<TransactionEntryPackage>;
}
