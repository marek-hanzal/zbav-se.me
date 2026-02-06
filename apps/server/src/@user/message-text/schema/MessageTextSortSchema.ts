import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageTextSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageTextSortField", {
				description: "Available sort fields for listing transaction message",
			}),
		order: OrderEnumSchema,
	})
	.openapi("MessageTextSort", {
		description: "Sort parameters for listing transaction message collection",
	});

export type MessageTextSortSchema = typeof MessageTextSortSchema;

export namespace MessageTextSortSchema {
	export type Type = z.infer<MessageTextSortSchema>;
}
