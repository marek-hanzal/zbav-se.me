import { z } from "zod";

export const UserExTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the user_ex record",
		}),
		userId: z.string().meta({
			description: "ID of the user (foreign key)",
		}),
		locationId: z.string().nullable().meta({
			description: "Default location for the user - user for listings & listing sorting",
		}),
	})
	.meta({
		id: "UserExTable",
		description: "Database row for an extended user profile.",
	})
	.strip();

export type UserExTableSchema = typeof UserExTableSchema;

export namespace UserExTableSchema {
	export type Type = z.infer<UserExTableSchema>;
}
