import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "./UserSideEnumSchema";

export const UserExDbSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the user_ex record",
		}),
		userId: z.string().openapi({
			description: "ID of the user (foreign key)",
		}),
		locationId: z
			.xor([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "Default location for the user - user for listings & listing sorting",
			}),
		side: z
			.union([
				UserSideEnumSchema,
				z.null(),
			])
			.optional(),
	})
	.strip();

export type UserExDbSchema = typeof UserExDbSchema;

export namespace UserExDbSchema {
	export type Type = z.infer<UserExDbSchema>;
}
