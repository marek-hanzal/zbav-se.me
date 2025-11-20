import { z } from "@hono/zod-openapi";
import { UserSideSchema } from "../../../app/user-ex/schema/UserSideSchema";

export const UserExPatchSchema = z
	.object({
		locationId: z.string().nullish().openapi({
			description: "Default location for the user - used for listings & listing sorting",
		}),
		side: z
			.union([
				UserSideSchema,
				z.null(),
			])
			.optional(),
	})
	.openapi("UserExPatch", {
		description: "Data for patching a user ex",
	});

export type UserExPatchSchema = typeof UserExPatchSchema;

export namespace UserExPatchSchema {
	export type Type = z.infer<UserExPatchSchema>;
}
