import { z } from "@hono/zod-openapi";
import { LocationSchema as DatabaseLocationSchema } from "~/database/@table/TransactionEntryTableSchema/LocationSchema";
import { EntrySchema } from "./EntrySchema";

export const LocationSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabaseLocationSchema.shape.kind,
		payload: DatabaseLocationSchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryLocation");
