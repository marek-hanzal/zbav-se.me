import { z } from "zod";
import { BuyerMessageSchema } from "~/user-activity/schema/ActivityCreateBuyerMessageSchema";
import { FavouriteSchema } from "~/user-activity/schema/ActivityCreateFavouriteSchema";
import { FlagSchema } from "~/user-activity/schema/ActivityCreateFlagSchema";
import { IgnoreSchema } from "~/user-activity/schema/ActivityCreateIgnoreSchema";
import { SellerMessageSchema } from "~/user-activity/schema/ActivityCreateSellerMessageSchema";
import { SystemSchema } from "~/user-activity/schema/ActivityCreateSystemSchema";
import { ThumbSchema } from "~/user-activity/schema/ActivityCreateThumbSchema";
import { TransactionSchema } from "~/user-activity/schema/ActivityCreateTransactionSchema";
import { UnfavouriteSchema } from "~/user-activity/schema/ActivityCreateUnfavouriteSchema";
import { UnflagSchema } from "~/user-activity/schema/ActivityCreateUnflagSchema";
import { UnignoreSchema } from "~/user-activity/schema/ActivityCreateUnignoreSchema";
import { UnknownSchema } from "~/user-activity/schema/ActivityCreateUnknownSchema";

export const ActivityCreateSchema = z
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
		id: "ActivityCreate",
		description: "Activity create union",
	});

export type ActivityCreateSchema = typeof ActivityCreateSchema;

export namespace ActivityCreateSchema {
	export type Type = z.infer<ActivityCreateSchema>;
}
