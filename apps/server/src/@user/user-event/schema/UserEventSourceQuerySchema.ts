import { z } from "@hono/zod-openapi";

export const UserEventSourceQuerySchema = z
	.object({
		userid: z.string().openapi({
			description: "The user ID to fetch events for",
			example: "user_123",
		}),
	})
	.openapi("UserEventSourceQuery", {
		description: "Query parameters for user event source",
	});

export type UserEventSourceQuerySchema = typeof UserEventSourceQuerySchema;

export namespace UserEventSourceQuerySchema {
	export type Type = z.infer<UserEventSourceQuerySchema>;
}
