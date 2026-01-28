import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessagePersonalSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessagePersonalSortField", {
				description: "Available sort fields for message personal collection",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessagePersonalSort", {
		description: "Sort configuration for message personal collection",
	});

export type MessagePersonalSortSchema = typeof MessagePersonalSortSchema;

export namespace MessagePersonalSortSchema {
	export type Type = z.infer<MessagePersonalSortSchema>;
}
