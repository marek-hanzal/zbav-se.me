import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/@user/inbox/schema/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const InboxFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Inbox owner filter",
		}),
		reference: z.string().optional().openapi({
			description: "Normalized reference filter",
		}),
		family: InboxFamilyEnumSchema.optional(),
		type: InboxTypeEnumSchema.optional(),
		priority: InboxPriorityEnumSchema.optional(),
		archivedAtIsNull: z.boolean().optional().openapi({
			description: "Filter archived/null state",
		}),
		timestampGte: z.coerce.date().optional().openapi({
			description: "Lower timestamp bound",
			type: "string",
		}),
		timestampLte: z.coerce.date().optional().openapi({
			description: "Upper timestamp bound",
			type: "string",
		}),
	})
	.openapi("InboxFilter", {
		description: "Inbox filters",
	});

export type InboxFilterSchema = typeof InboxFilterSchema;

export namespace InboxFilterSchema {
	export type Type = z.infer<InboxFilterSchema>;
}
