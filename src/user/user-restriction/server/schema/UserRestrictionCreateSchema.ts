import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const UserRestrictionCreateSchema = z
	.looseObject({
		restriction: RestrictionEnumSchema.meta({
			description: "Restriction levels applied to the user",
		}),
	})
	.strip()
	.meta({
		id: "UserRestrictionCreate",
		description: "Data for creating a user restriction",
	});

export type UserRestrictionCreateSchema = typeof UserRestrictionCreateSchema;

export namespace UserRestrictionCreateSchema {
	export type Type = z.infer<UserRestrictionCreateSchema>;
}
