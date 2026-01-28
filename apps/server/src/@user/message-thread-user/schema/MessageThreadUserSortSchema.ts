import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageThreadUserSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageThreadUserSortField", {
				description: "Available sort fields for message thread user",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessageThreadUserSort", {
		description: "Sort parameters for message thread user collection",
	});

export type MessageThreadUserSortSchema = typeof MessageThreadUserSortSchema;

export namespace MessageThreadUserSortSchema {
	export type Type = z.infer<MessageThreadUserSortSchema>;
}
