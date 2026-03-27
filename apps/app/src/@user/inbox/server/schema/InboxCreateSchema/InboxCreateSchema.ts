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

export const InboxCreateSchema = z
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
		id: "InboxCreate",
		description: "Inbox create union",
	});

export type InboxCreateSchema = typeof InboxCreateSchema;

export namespace InboxCreateSchema {
	export type Type = z.infer<InboxCreateSchema>;
}
