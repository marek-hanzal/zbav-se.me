import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "~/app/user-ex/schema/UserSideEnumSchema";

export const UserExTableSchema = z
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

export type UserExTableSchema = typeof UserExTableSchema;

export namespace UserExTableSchema {
	export type Type = z.infer<UserExTableSchema>;
}
