import { z } from "@hono/zod-openapi";
import { BuyerMessageSchema } from "./BuyerMessageSchema";
import { FavouriteSchema } from "./FavouriteSchema";
import { SellerMessageSchema } from "./SellerMessageSchema";
import { SystemSchema } from "./SystemSchema";
import { ThumbSchema } from "./ThumbSchema";
import { TransactionSchema } from "./TransactionSchema";
import { UnfavouriteSchema } from "./UnfavouriteSchema";
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
	/**
	 * We intentionally does not have .openapi() here as the create schema is
	 * consumed as a local contract and the branches already carry the shape.
	 */
]);

export type InboxCreateSchema = typeof InboxCreateSchema;

export namespace InboxCreateSchema {
	export type Type = z.infer<InboxCreateSchema>;
}
