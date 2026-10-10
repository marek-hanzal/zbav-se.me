import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import { ActivitySchema } from "~/user-activity/schema/ActivityCreateActivitySchema";

export const FavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"reaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"listing.favourite",
		]),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "ActivityFavouriteCreate",
	});
