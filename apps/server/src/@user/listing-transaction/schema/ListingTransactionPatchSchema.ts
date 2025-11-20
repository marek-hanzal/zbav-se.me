import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";

export const ListingTransactionPatchSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the listing transaction to patch",
		}),
		status: ListingTransactionStatusSchema.optional(),
		side: ListingTransactionSideSchema.optional(),
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
