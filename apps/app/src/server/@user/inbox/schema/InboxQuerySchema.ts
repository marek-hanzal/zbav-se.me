import { z } from "@hono/zod-openapi";
import { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";
import { InboxSortSchema } from "~/@user/inbox/schema/InboxSortSchema";
import { InboxWhereSchema } from "~/@user/inbox/schema/InboxWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

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
