import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import { ThumbEnumSchema } from "~/listing/schema/ThumbEnumSchema";
import { ActivitySchema } from "~/user-activity/schema/ActivityCreateActivitySchema";

export const ThumbSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"reaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"thumb",
		]),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Listing identifier",
			}),
			thumb: ThumbEnumSchema,
		}),
	})
	.strip()
	.meta({
		id: "ActivityThumbCreate",
	});

export type ThumbSchema = typeof ThumbSchema;

export namespace ThumbSchema {
	export type Type = z.infer<ThumbSchema>;
}
