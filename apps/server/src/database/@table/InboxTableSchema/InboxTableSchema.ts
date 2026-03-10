import { z } from "@hono/zod-openapi";
import { BuyerMessageSchema } from "./BuyerMessageSchema";
import { FavouriteSchema } from "./FavouriteSchema";
import { SellerMessageSchema } from "./SellerMessageSchema";
import { SystemSchema } from "./SystemSchema";
import { ThumbSchema } from "./ThumbSchema";
import { TransactionSchema } from "./TransactionSchema";
import { UnfavouriteSchema } from "./UnfavouriteSchema";
import { UnknownSchema } from "./UnknownSchema";

export const InboxTableSchema = z
	.discriminatedUnion("type", [
		BuyerMessageSchema,
		SellerMessageSchema,
		TransactionSchema,
		SystemSchema,
		UnknownSchema,
		ThumbSchema,
		FavouriteSchema,
		UnfavouriteSchema,
	])
	.openapi("Inbox", {
		description: "Inbox item",
	});

export type InboxTableSchema = typeof InboxTableSchema;

export namespace InboxTableSchema {
	export type Type = z.infer<InboxTableSchema>;
}
