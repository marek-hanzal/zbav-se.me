import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { UserEventFilterSchema } from "~/@user/user-event/schema/UserEventFilterSchema";
import { UserEventSortSchema } from "~/@user/user-event/schema/UserEventSortSchema";
import { UserEventWhereSchema } from "~/@user/user-event/schema/UserEventWhereSchema";

export const UserEventQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: UserEventFilterSchema.omit({
			userId: true,
		}).optional(),
		where: UserEventWhereSchema.optional(),
		sort: UserEventSortSchema.array().optional(),
	})
	.openapi("UserEventQuery", {
		description: "Query object for user event collection",
	});

export type UserEventQuerySchema = typeof UserEventQuerySchema;

export namespace UserEventQuerySchema {
	export type Type = z.infer<UserEventQuerySchema>;
}
