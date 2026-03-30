import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const UserEventSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"group",
				"id",
			])
			.meta({
				id: "UserEventSortField",
				description: "Field of the user event sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "UserEventSort",
		description: "Sort object for user event collection",
	});

export type UserEventSortSchema = typeof UserEventSortSchema;

export namespace UserEventSortSchema {
	export type Type = z.infer<UserEventSortSchema>;
}
