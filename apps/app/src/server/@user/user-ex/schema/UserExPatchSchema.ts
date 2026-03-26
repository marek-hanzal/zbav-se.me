import { z } from "@hono/zod-openapi";
import { UserExTableSchema } from "~/server/database/@table/UserExTableSchema";

export const UserExPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...UserExTableSchema.shape,
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
