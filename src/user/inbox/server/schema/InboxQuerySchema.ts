import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { InboxFilterSchema } from "~/user/inbox/server/schema/InboxFilterSchema";
import { InboxSortSchema } from "~/user/inbox/server/schema/InboxSortSchema";
import { InboxWhereSchema } from "~/user/inbox/server/schema/InboxWhereSchema";

export const InboxQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: InboxFilterSchema.optional(),
		where: InboxWhereSchema.optional(),
		sort: InboxSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "InboxQuery",
		description: "Query object for inbox collection",
	});

export type InboxQuerySchema = typeof InboxQuerySchema;

export namespace InboxQuerySchema {
	export type Type = z.infer<InboxQuerySchema>;
}
