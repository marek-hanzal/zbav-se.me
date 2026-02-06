import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageThreadSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.openapi("MessageThreadSortField", {
				description: "Available sort fields for message thread",
			}),
		order: OrderEnumSchema,
	})
	.openapi("MessageThreadSort", {
		description: "Sort parameters for message thread collection",
	});

export type MessageThreadSortSchema = typeof MessageThreadSortSchema;

export namespace MessageThreadSortSchema {
	export type Type = z.infer<MessageThreadSortSchema>;
}
