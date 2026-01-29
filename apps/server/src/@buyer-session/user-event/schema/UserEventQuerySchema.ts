import { z } from "@hono/zod-openapi";
import { UserEventFilterSchema } from "~/@buyer-session/user-event/schema/UserEventFilterSchema";
import { UserEventSortSchema } from "~/@buyer-session/user-event/schema/UserEventSortSchema";
import { UserEventWhereSchema } from "~/@buyer-session/user-event/schema/UserEventWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

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
