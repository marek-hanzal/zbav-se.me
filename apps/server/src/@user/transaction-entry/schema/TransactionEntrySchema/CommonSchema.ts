import { z } from "@hono/zod-openapi";
import { CommonSchema as DatabaseCommonSchema } from "~/database/@table/TransactionEntryTableSchema/CommonSchema";
import { EntrySchema } from "./EntrySchema";

export const CommonSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabaseCommonSchema.shape.kind,
		payload: DatabaseCommonSchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryCommon", {
		description: "Common entry payload",
	});
