import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/@user/inbox/schema/InboxTypeEnumSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const InboxFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Inbox owner filter",
		}),
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
