import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageSortSchema = z
	.object({
		field: z
			.enum([
				"id",
				"createdAt",
			])
			.openapi("MessageSortField", {
				description: "Available sort fields for message collection",
			}),
		order: OrderEnumSchema,
	})
	.openapi("MessageSort", {
		description: "Sort parameters for message collection",
	});

export type MessageSortSchema = typeof MessageSortSchema;

export namespace MessageSortSchema {
	export type Type = z.infer<MessageSortSchema>;
}
