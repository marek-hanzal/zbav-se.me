import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import { ActivitySchema } from "~/database/schema/ActivityTableActivitySchema";
import { ThumbEnumSchema } from "~/listing/schema/ThumbEnumSchema";

export const ThumbSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"reaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"thumb",
		]),
		payload: z
			.looseObject({
				listingId: z.string().meta({
					description: "Listing identifier",
				}),
				thumb: ThumbEnumSchema,
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivityThumb",
		description: "Activity reaction event for thumb",
	});

export type ThumbSchema = typeof ThumbSchema;

export namespace ThumbSchema {
	export type Type = z.infer<ThumbSchema>;
}
