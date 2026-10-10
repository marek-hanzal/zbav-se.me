import { z } from "zod";
import { BuyerMessageSchema } from "~/database/schema/ActivityTableBuyerMessageSchema";
import { FavouriteSchema } from "~/database/schema/ActivityTableFavouriteSchema";
import { FlagSchema } from "~/database/schema/ActivityTableFlagSchema";
import { IgnoreSchema } from "~/database/schema/ActivityTableIgnoreSchema";
import { SellerMessageSchema } from "~/database/schema/ActivityTableSellerMessageSchema";
import { SystemSchema } from "~/database/schema/ActivityTableSystemSchema";
import { ThumbSchema } from "~/database/schema/ActivityTableThumbSchema";
import { TransactionSchema } from "~/database/schema/ActivityTableTransactionSchema";
import { UnfavouriteSchema } from "~/database/schema/ActivityTableUnfavouriteSchema";
import { UnflagSchema } from "~/database/schema/ActivityTableUnflagSchema";
import { UnignoreSchema } from "~/database/schema/ActivityTableUnignoreSchema";
import { UnknownSchema } from "~/database/schema/ActivityTableUnknownSchema";

export const ActivityTableSchema = z
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
		id: "ActivityTable",
		description: "Database row variants for activity entries.",
	});

export type ActivityTableSchema = typeof ActivityTableSchema;

export namespace ActivityTableSchema {
	export type Type = z.infer<ActivityTableSchema>;
}
