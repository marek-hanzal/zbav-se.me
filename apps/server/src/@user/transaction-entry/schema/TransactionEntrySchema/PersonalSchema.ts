import { z } from "@hono/zod-openapi";
import { PersonalSchema as DatabasePersonalSchema } from "~/database/@table/TransactionEntryTableSchema/PersonalSchema";
import { EntrySchema } from "./EntrySchema";

export const PersonalSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabasePersonalSchema.shape.kind,
		payload: DatabasePersonalSchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryPersonal");
