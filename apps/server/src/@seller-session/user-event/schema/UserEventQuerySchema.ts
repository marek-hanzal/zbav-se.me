import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { UserEventFilterSchema } from "~/@seller-session/user-event/schema/UserEventFilterSchema";
import { UserEventSortSchema } from "~/@seller-session/user-event/schema/UserEventSortSchema";
import { UserEventWhereSchema } from "~/@seller-session/user-event/schema/UserEventWhereSchema";

export const UserEventQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: UserEventFilterSchema.omit({
			userId: true,
		}).optional(),
		where: UserEventWhereSchema.optional(),
		sort: UserEventSortSchema.array().optional(),
	})
	.strip()
	.openapi("UserEventQuery", {
		description: "Query object for user event collection",
	});

export type UserEventQuerySchema = typeof UserEventQuerySchema;

export namespace UserEventQuerySchema {
	export type Type = z.infer<UserEventQuerySchema>;
}
