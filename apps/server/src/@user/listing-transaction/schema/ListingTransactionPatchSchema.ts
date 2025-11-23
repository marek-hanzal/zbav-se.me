import { z } from "@hono/zod-openapi";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusEnumSchema";

export const ListingTransactionPatchSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the listing transaction to patch",
		}),
		status: ListingTransactionStatusEnumSchema.optional(),
		side: ListingTransactionSideEnumSchema.optional(),
	})
	.refine((value) => Boolean(value.status ?? value.side), {
		message: "Provide at least side or status to patch",
		path: [
			"status",
		],
	})
	.openapi("ListingTransactionPatch", {
		description: "Payload for patching a listing transaction",
	});

export type ListingTransactionPatchSchema = typeof ListingTransactionPatchSchema;

export namespace ListingTransactionPatchSchema {
	export type Type = z.infer<ListingTransactionPatchSchema>;
}
