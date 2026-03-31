import { z } from "zod";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";

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
		side: UserSideEnumSchema.nullish(),
		token: z.string().nullish().meta({
			description: "Bearer token used for agent access and API token fallback auth",
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
