import { z } from "@hono/zod-openapi";
import { UserExDbSchema } from "~/app/user-ex/schema/UserExDbSchema";

export const UserExPatchSchema = z
	.object({
		patch: z
			.object({
				...UserExDbSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
	})
	.openapi("UserExPatch", {
		description: "Data for patching a user ex",
	});

export type UserExPatchSchema = typeof UserExPatchSchema;

export namespace UserExPatchSchema {
	export type Type = z.infer<UserExPatchSchema>;
}
