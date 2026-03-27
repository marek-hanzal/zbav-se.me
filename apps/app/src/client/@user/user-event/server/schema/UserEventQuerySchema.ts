import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { UserEventFilterSchema } from "./UserEventFilterSchema";
import { UserEventSortSchema } from "./UserEventSortSchema";
import { UserEventWhereSchema } from "./UserEventWhereSchema";

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
	.meta({
		id: "UserEventQuery",
		description: "Query object for user event collection",
	});

export type UserEventQuerySchema = typeof UserEventQuerySchema;

export namespace UserEventQuerySchema {
	export type Type = z.infer<UserEventQuerySchema>;
}
