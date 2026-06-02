import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";

export const ActivityWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Activity owner filter",
		}),
		reference: z.string().optional().meta({
			description: "Match activity rows whose reference array contains this key",
		}),
		referenceIn: z.array(z.string()).min(1).optional().meta({
			description: "Match activity rows whose reference array overlaps any of these keys",
		}),
		referenceAllIn: z.array(z.string()).min(1).optional().meta({
			description: "Match activity rows whose reference array contains all of these keys",
		}),
		family: ActivityFamilyEnumSchema.optional(),
		type: ActivityTypeEnumSchema.optional(),
		priority: ActivityPriorityEnumSchema.optional(),
		archivedAtIsNull: z.boolean().optional().meta({
			description: "Filter archived/null state",
		}),
		timestampGte: z.coerce.date().optional().meta({
			description: "Lower timestamp bound",
			type: "string",
		}),
		timestampLte: z.coerce.date().optional().meta({
			description: "Upper timestamp bound",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "ActivityWhere",
		description: "App-level where filters",
	});

export type ActivityWhereSchema = typeof ActivityWhereSchema;

export namespace ActivityWhereSchema {
	export type Type = z.infer<ActivityWhereSchema>;
}
