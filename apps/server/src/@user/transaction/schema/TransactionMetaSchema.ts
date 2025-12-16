import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "~/app/user-ex/schema/UserSideEnumSchema";

export const TransactionMetaSchema = z
	.object({
		side: UserSideEnumSchema.optional(),
	})
	.openapi("TransactionMeta", {
		description: "Meta data for transaction collection",
	});

export type TransactionMetaSchema = typeof TransactionMetaSchema;

export namespace TransactionMetaSchema {
	export type Type = z.infer<TransactionMetaSchema>;
}
