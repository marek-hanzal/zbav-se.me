import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageSortField", {
				description: "Available sort fields for listing transaction message",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessageSort", {
		description: "Sort parameters for listing transaction message collection",
	});

export type MessageSortSchema = typeof MessageSortSchema;

export namespace MessageSortSchema {
	export type Type = z.infer<MessageSortSchema>;
}
