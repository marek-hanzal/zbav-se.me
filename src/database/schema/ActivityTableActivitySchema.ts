import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityPriorityEnumSchema } from "~/activity/schema/ActivityPriorityEnumSchema";

export const ActivitySchema = z
	.looseObject({
		id: z.string().meta({
			description: "Activity identifier",
		}),
		userId: z.string().meta({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).meta({
			description: "Normalized reference keys used for activity grouping",
		}),
		timestamp: z.coerce.date().meta({
			description: "Activity event timestamp",
			type: "string",
		}),
		family: ActivityFamilyEnumSchema,
		priority: ActivityPriorityEnumSchema,
		archivedAt: z.coerce.date().nullable().meta({
			description: "Archive timestamp (null = active)",
		}),
	})
	.strip()
	.meta({
		id: "Activity",
		description: "Activity table row",
	});

export type ActivitySchema = typeof ActivitySchema;

export namespace ActivitySchema {
	export type Type = z.infer<ActivitySchema>;
}
