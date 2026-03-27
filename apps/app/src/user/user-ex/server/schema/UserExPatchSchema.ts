import { z } from "zod";
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
			.meta({
				description: "Fields to update (all optional)",
			}),
	})
	.strip()
	.meta({
		id: "UserExPatch",
		description: "Data for patching a user ex",
	});

export type UserExPatchSchema = typeof UserExPatchSchema;

export namespace UserExPatchSchema {
	export type Type = z.infer<UserExPatchSchema>;
}
