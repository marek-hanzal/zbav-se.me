import { z } from "@hono/zod-openapi";
import { UserSideSchema } from "./UserSideSchema";

export const UserPatchSchema = z
	.object({
		locationId: z.string().nullish().openapi({
			description:
				"Default location for the user - used for listings & listing sorting",
		}),
		side: UserSideSchema.nullish(),
	})
	.openapi("UserPatch", {
		description: "Schema for patching user extended information",
	});

export type UserPatchSchema = typeof UserPatchSchema;

export namespace UserPatchSchema {
	export type Type = z.infer<UserPatchSchema>;
}
