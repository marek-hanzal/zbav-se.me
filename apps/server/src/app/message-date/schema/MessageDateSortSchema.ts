import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageDateSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageDateSortField", {
				description: "Available sort fields for message date",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessageDateSort", {
		description: "Sort parameters for message date collection",
	});

export type MessageDateSortSchema = typeof MessageDateSortSchema;

export namespace MessageDateSortSchema {
	export type Type = z.infer<MessageDateSortSchema>;
}
