import { z } from "zod";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";

export const UserRestrictionCreateFnSchema = z
	.looseObject({
		restriction: z.array(CategoryRestrictionEnumSchema).min(1).meta({
			description: "Restriction levels applied to the user",
		}),
	})
	.strip()
	.meta({
		id: "UserRestrictionCreateFn",
		description: "Client request data for creating a user restriction",
	});

export type UserRestrictionCreateFnSchema = typeof UserRestrictionCreateFnSchema;

export namespace UserRestrictionCreateFnSchema {
	export type Type = z.infer<UserRestrictionCreateFnSchema>;
}
