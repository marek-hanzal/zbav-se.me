import { z } from "@hono/zod-openapi";
import { UserEventDbSchema } from "~/app/user-event/schema/UserEventDbSchema";

export const UserEventSourceResponseSchema = z
	.object({
		events: z.array(UserEventDbSchema).openapi({
			description: "Array of user events",
		}),
	})
	.openapi("UserEventSourceResponse", {
		description: "Response containing user events",
	});

export type UserEventSourceResponseSchema = typeof UserEventSourceResponseSchema;

export namespace UserEventSourceResponseSchema {
	export type Type = z.infer<UserEventSourceResponseSchema>;
}
