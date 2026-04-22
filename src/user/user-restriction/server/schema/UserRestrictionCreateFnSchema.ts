import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const UserRestrictionCreateFnSchema = z
	.looseObject({
		restriction: RestrictionEnumSchema.meta({
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
