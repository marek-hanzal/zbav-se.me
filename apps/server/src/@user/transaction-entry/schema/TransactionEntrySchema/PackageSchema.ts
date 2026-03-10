import { z } from "@hono/zod-openapi";
import { PackageSchema as DatabasePackageSchema } from "~/database/@table/TransactionEntryTableSchema/PackageSchema";
import { EntrySchema } from "./EntrySchema";

export const PackageSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabasePackageSchema.shape.kind,
		payload: DatabasePackageSchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryPackage");
