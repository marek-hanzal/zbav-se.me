import { z } from "@hono/zod-openapi";
import { TextSchema as DatabaseTextSchema } from "~/database/@table/TransactionEntryTableSchema/TextSchema";
import { EntrySchema } from "./EntrySchema";

export const TextSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabaseTextSchema.shape.kind,
		payload: DatabaseTextSchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryText");
