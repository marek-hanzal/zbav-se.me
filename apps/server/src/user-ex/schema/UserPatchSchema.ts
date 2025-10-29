import { z } from "@hono/zod-openapi";

export const UserPatchSchema = z
	.object({
		locationId: z.string().openapi({
			description:
				"Default location for the user - used for listings & listing sorting",
		}),
	})
	.openapi("UserPatch", {
		description: "Schema for patching user extended information",
	});

export type UserPatchSchema = typeof UserPatchSchema;

export namespace UserPatchSchema {
	export type Type = z.infer<typeof UserPatchSchema>;
}
