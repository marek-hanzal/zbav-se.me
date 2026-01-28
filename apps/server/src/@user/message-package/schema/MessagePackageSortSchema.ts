import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessagePackageSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessagePackageSortField", {
				description: "Available sort fields for message package",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessagePackageSort", {
		description: "Sort parameters for message package collection",
	});

export type MessagePackageSortSchema = typeof MessagePackageSortSchema;

export namespace MessagePackageSortSchema {
	export type Type = z.infer<MessagePackageSortSchema>;
}
