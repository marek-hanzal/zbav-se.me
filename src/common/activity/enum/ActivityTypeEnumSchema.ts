import { z } from "zod";

export const ActivityTypeEnumSchema = z
	.enum([
		"buyer-message",
		"seller-message",
		"transaction",
		"system",
		"unknown",
		"thumb",
		"listing.favourite",
		"unfavourite",
		"listing.flag",
		"unflag",
		"listing.ignore",
		"unignore",
	])
	.meta({
		id: "ActivityTypeEnum",
		description: "Activity type",
	});

export type ActivityTypeEnumSchema = typeof ActivityTypeEnumSchema;

export namespace ActivityTypeEnumSchema {
	export type Type = z.infer<ActivityTypeEnumSchema>;
}
