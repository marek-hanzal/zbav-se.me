import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "../../../app/user-ex/schema/UserSideEnumSchema";

export const ListingTransactionMetaSchema = z
	.object({
		side: UserSideEnumSchema.optional(),
	})
	.openapi("ListingTransactionMeta", {
		description: "Meta data for listing transaction collection",
	});

export type ListingTransactionMetaSchema = typeof ListingTransactionMetaSchema;

export namespace ListingTransactionMetaSchema {
	export type Type = z.infer<ListingTransactionMetaSchema>;
}
