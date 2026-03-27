import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { InboxFamilyEnumSchema } from "~/common/inbox/enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/common/inbox/enum/InboxTypeEnumSchema";

export const InboxFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Inbox owner filter",
		}),
		reference: z.string().optional().meta({
			description: "Match inbox rows whose reference array contains this key",
		}),
		referenceIn: z.array(z.string()).min(1).optional().meta({
			description: "Match inbox rows whose reference array overlaps any of these keys",
		}),
		referenceAllIn: z.array(z.string()).min(1).optional().meta({
			description: "Match inbox rows whose reference array contains all of these keys",
		}),
		family: InboxFamilyEnumSchema.optional(),
		type: InboxTypeEnumSchema.optional(),
		priority: InboxPriorityEnumSchema.optional(),
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
		id: "InboxFilter",
		description: "Inbox filters",
	});

export type InboxFilterSchema = typeof InboxFilterSchema;

export namespace InboxFilterSchema {
	export type Type = z.infer<InboxFilterSchema>;
}
