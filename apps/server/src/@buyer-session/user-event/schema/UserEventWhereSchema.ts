import { z } from "@hono/zod-openapi";
import { UserEventFilterSchema } from "~/@buyer-session/user-event/schema/UserEventFilterSchema";

export const UserEventWhereSchema = z
	.looseObject({
		...UserEventFilterSchema.shape,
	})
	.omit({ userId: true })
	.strip()
	.openapi("UserEventWhere", {
		description: "App-based filters",
	});

export type UserEventWhereSchema = typeof UserEventWhereSchema;

export namespace UserEventWhereSchema {
	export type Type = z.infer<UserEventWhereSchema>;
}
