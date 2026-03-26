import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const UserEventSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"group",
				"id",
			])
			.openapi("UserEventSortField", {
				description: "Field of the user event sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("UserEventSort", {
		description: "Sort object for user event collection",
	});

export type UserEventSortSchema = typeof UserEventSortSchema;

export namespace UserEventSortSchema {
	export type Type = z.infer<UserEventSortSchema>;
}
