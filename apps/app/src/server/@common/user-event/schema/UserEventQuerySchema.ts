import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { UserEventFilterSchema } from "~/server/@common/user-event/schema/UserEventFilterSchema";
import { UserEventSortSchema } from "~/server/@common/user-event/schema/UserEventSortSchema";
import { UserEventWhereSchema } from "~/server/@common/user-event/schema/UserEventWhereSchema";

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
