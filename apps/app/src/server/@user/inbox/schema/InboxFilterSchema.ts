import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";
import { InboxFamilyEnumSchema } from "~/server/database/@enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/server/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/server/database/@enum/InboxTypeEnumSchema";

export const InboxFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Inbox owner filter",
		}),
		reference: z.string().optional().openapi({
			description: "Match inbox rows whose reference array contains this key",
		}),
		referenceIn: z.array(z.string()).min(1).optional().openapi({
			description: "Match inbox rows whose reference array overlaps any of these keys",
		}),
		referenceAllIn: z.array(z.string()).min(1).optional().openapi({
			description: "Match inbox rows whose reference array contains all of these keys",
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
	.strip()
	.openapi("InboxFilter", {
		description: "Inbox filters",
	});

export type InboxFilterSchema = typeof InboxFilterSchema;

export namespace InboxFilterSchema {
	export type Type = z.infer<InboxFilterSchema>;
}
