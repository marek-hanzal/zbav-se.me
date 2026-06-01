import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const FavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"reaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"listing.favourite",
		]),
		payload: z
			.looseObject({
				listingId: z.string().meta({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivityFavourite",
		description: "Activity reaction event for favourite",
	});

export type FavouriteSchema = typeof FavouriteSchema;

export namespace FavouriteSchema {
	export type Type = z.infer<FavouriteSchema>;
}
