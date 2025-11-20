import { z } from "@hono/zod-openapi";
import { UserSideSchema } from "../../../app/user-ex/schema/UserSideSchema";

export const ListingTransactionMetaSchema = z
	.object({
		side: UserSideSchema.optional(),
	})
	.openapi("ListingTransactionMeta", {
		description: "Meta data for listing transaction collection",
	});

export type ListingTransactionMetaSchema = typeof ListingTransactionMetaSchema;

export namespace ListingTransactionMetaSchema {
	export type Type = z.infer<ListingTransactionMetaSchema>;
}
