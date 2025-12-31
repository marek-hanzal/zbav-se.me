import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const UserEventSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"group",
			])
			.openapi("UserEventSortField", {
				description: "Field of the user event sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("UserEventSort", {
		description: "Sort object for user event collection",
	});

export type UserEventSortSchema = typeof UserEventSortSchema;

export namespace UserEventSortSchema {
	export type Type = z.infer<UserEventSortSchema>;
}
