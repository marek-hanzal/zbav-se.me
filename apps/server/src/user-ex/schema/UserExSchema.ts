import { z } from "@hono/zod-openapi";
import { UserSideSchema } from "./UserSideSchema";

export const UserExSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the user_ex record",
		}),
		userId: z.string().openapi({
			description: "ID of the user (foreign key)",
		}),
		locationId: z.string().nullish().openapi({
			description:
				"Default location for the user - user for listings & listing sorting",
		}),
		side: UserSideSchema.nullish(),
	})
	.openapi("UserEx", {
		description: "Extended user information table",
	});

export type UserExSchema = typeof UserExSchema;

export namespace UserExSchema {
	export type Type = z.infer<UserExSchema>;
}
