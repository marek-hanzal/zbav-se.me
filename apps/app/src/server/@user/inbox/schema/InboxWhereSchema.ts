import { z } from "@hono/zod-openapi";
import { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";

export const InboxWhereSchema = z
	.looseObject({
		...InboxFilterSchema.shape,
	})
	.strip()
	.openapi("InboxWhere", {
		description: "App-level where filters",
	});

export type InboxWhereSchema = typeof InboxWhereSchema;

export namespace InboxWhereSchema {
	export type Type = z.infer<InboxWhereSchema>;
}
