import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "~/database/@enum/UserSideEnumSchema";

export const UserExTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the user_ex record",
		}),
		userId: z.string().openapi({
			description: "ID of the user (foreign key)",
		}),
		locationId: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "Default location for the user - user for listings & listing sorting",
			}),
		side: z
			.union([
				z.null(),
				UserSideEnumSchema,
			])
			.optional(),
		mcp: z
			.union([
				z.string(),
				z.null(),
			])
			.optional()
			.openapi({
				description: "MCP bearer token used for agent access",
			}),
	})
	.strip();

export type UserExTableSchema = typeof UserExTableSchema;

export namespace UserExTableSchema {
	export type Type = z.infer<UserExTableSchema>;
}
