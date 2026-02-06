import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageLocationSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageLocationSortField", {
				description: "Available sort fields for message location",
			}),
		order: OrderEnumSchema,
	})
	.openapi("MessageLocationSort", {
		description: "Sort parameters for message location collection",
	});

export type MessageLocationSortSchema = typeof MessageLocationSortSchema;

export namespace MessageLocationSortSchema {
	export type Type = z.infer<MessageLocationSortSchema>;
}
