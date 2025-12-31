import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { UserEventFilterSchema } from "./UserEventFilterSchema";
import { UserEventSortSchema } from "./UserEventSortSchema";

export const UserEventQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: UserEventFilterSchema.optional(),
		where: UserEventFilterSchema.openapi("UserEventWhere", {
			description: "App-based filters",
		}).optional(),
		sort: UserEventSortSchema.array().optional(),
	})
	.openapi("UserEventQuery", {
		description: "Query object for user event collection",
	});

export type UserEventQuerySchema = typeof UserEventQuerySchema;

export namespace UserEventQuerySchema {
	export type Type = z.infer<UserEventQuerySchema>;
}
