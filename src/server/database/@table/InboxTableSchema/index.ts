import { z } from "zod";
import { BuyerMessageSchema } from "./BuyerMessageSchema";
import { FavouriteSchema } from "./FavouriteSchema";
import { FlagSchema } from "./FlagSchema";
import { IgnoreSchema } from "./IgnoreSchema";
import { SellerMessageSchema } from "./SellerMessageSchema";
import { SystemSchema } from "./SystemSchema";
import { ThumbSchema } from "./ThumbSchema";
import { TransactionSchema } from "./TransactionSchema";
import { UnfavouriteSchema } from "./UnfavouriteSchema";
import { UnflagSchema } from "./UnflagSchema";
import { UnignoreSchema } from "./UnignoreSchema";
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
		FlagSchema,
		UnflagSchema,
		IgnoreSchema,
		UnignoreSchema,
	])
	.meta({
		id: "InboxTable",
		description: "Database row variants for inbox entries.",
	});

export type InboxTableSchema = typeof InboxTableSchema;

export namespace InboxTableSchema {
	export type Type = z.infer<InboxTableSchema>;
}
