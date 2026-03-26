import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const InboxSortSchema = z
	.looseObject({
		field: z
			.enum([
				"timestamp",
				"archivedAt",
				"priority",
			])
			.openapi("InboxSortField", {
				description: "Sort field for inbox collection",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("InboxSort", {
		description: "Sort object for inbox collection",
	});

export type InboxSortSchema = typeof InboxSortSchema;

export namespace InboxSortSchema {
	export type Type = z.infer<InboxSortSchema>;
}
