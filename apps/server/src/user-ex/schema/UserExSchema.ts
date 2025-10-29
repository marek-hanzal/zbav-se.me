import { z } from "@hono/zod-openapi";

export const UserExSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the user_ex record",
		}),
		userId: z.string().openapi({
			description: "ID of the user (foreign key)",
		}),
		locationId: z.string().optional().openapi({
			description:
				"Default location for the user - user for listings & listing sorting",
		}),
	})
	.openapi("UserEx", {
		description: "Extended user information table",
	});

export type UserExSchema = typeof UserExSchema;

export namespace UserExSchema {
	export type Type = z.infer<typeof UserExSchema>;
}
