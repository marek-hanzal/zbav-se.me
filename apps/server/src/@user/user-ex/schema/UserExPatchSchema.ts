import { z } from "@hono/zod-openapi";
import { UserExDbSchema } from "./UserExDbSchema";

export const UserExPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...UserExDbSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
			})
			.partial()
			.strip()
			.openapi({
				description: "Fields to update (all optional)",
			}),
	})
	.strip()
	.openapi("UserExPatch", {
		description: "Data for patching a user ex",
	});

export type UserExPatchSchema = typeof UserExPatchSchema;

export namespace UserExPatchSchema {
	export type Type = z.infer<UserExPatchSchema>;
}
