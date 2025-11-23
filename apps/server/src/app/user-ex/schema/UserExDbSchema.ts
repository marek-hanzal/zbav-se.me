import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "./UserSideEnumSchema";

export const UserExDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the user_ex record",
	}),
	userId: z.string().openapi({
		description: "ID of the user (foreign key)",
	}),
	locationId: z.string().nullish().openapi({
		description: "Default location for the user - user for listings & listing sorting",
	}),
	side: z
		.union([
			UserSideEnumSchema,
			z.null(),
		])
		.optional(),
});

export type UserExDbSchema = typeof UserExDbSchema;

export namespace UserExDbSchema {
	export type Type = z.infer<UserExDbSchema>;
}
