import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";

export const ActivitySchema = z
	.looseObject({
		userId: z.string().meta({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).optional().meta({
			description: "Optional normalized reference keys used for activity grouping",
		}),
		family: ActivityFamilyEnumSchema,
		priority: ActivityPriorityEnumSchema,
	})
	.strip()
	.meta({
		id: "ActivityCreateBase",
	});

export type ActivitySchema = typeof ActivitySchema;

export namespace ActivitySchema {
	export type Type = z.infer<ActivitySchema>;
}
