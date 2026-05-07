import { z } from "zod";

export const ActivityPriorityEnumSchema = z
	.enum([
		"common",
		"high",
	])
	.meta({
		id: "ActivityPriorityEnum",
		description: "Activity priority level",
	});

export type ActivityPriorityEnumSchema = typeof ActivityPriorityEnumSchema;

export namespace ActivityPriorityEnumSchema {
	export type Type = z.infer<ActivityPriorityEnumSchema>;
}
