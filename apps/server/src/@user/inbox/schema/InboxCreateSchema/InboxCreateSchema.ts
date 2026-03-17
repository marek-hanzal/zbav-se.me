import { z } from "@hono/zod-openapi";
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

export const InboxCreateSchema = z.discriminatedUnion("type", [
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
	/**
	 * We intentionally does not have .openapi() here as the create schema is
	 * consumed as a local contract and the branches already carry the shape.
	 */
]);

export type InboxCreateSchema = typeof InboxCreateSchema;

export namespace InboxCreateSchema {
	export type Type = z.infer<InboxCreateSchema>;
}
