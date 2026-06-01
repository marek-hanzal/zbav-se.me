import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const UnfavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"reaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"unfavourite",
		]),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "ActivityUnfavouriteCreate",
	});
