import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageSystemSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageSystemSortField", {
				description: "Available sort fields for system message",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessageSystemSort", {
		description: "Sort parameters for system message collection",
	});

export type MessageSystemSortSchema = typeof MessageSystemSortSchema;

export namespace MessageSystemSortSchema {
	export type Type = z.infer<MessageSystemSortSchema>;
}
