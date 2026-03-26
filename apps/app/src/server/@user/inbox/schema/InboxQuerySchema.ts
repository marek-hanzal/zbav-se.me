import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";
import { InboxSortSchema } from "~/server/@user/inbox/schema/InboxSortSchema";
import { InboxWhereSchema } from "~/server/@user/inbox/schema/InboxWhereSchema";

export const InboxQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: InboxFilterSchema.optional(),
		where: InboxWhereSchema.optional(),
		sort: InboxSortSchema.array().optional(),
	})
	.strip()
	.openapi("InboxQuery", {
		description: "Query object for inbox collection",
	});

export type InboxQuerySchema = typeof InboxQuerySchema;

export namespace InboxQuerySchema {
	export type Type = z.infer<InboxQuerySchema>;
}
