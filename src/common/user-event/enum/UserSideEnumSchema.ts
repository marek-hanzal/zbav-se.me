import { z } from "zod";

export const UserSideEnumSchema = z
	.enum([
		"seller",
		"buyer",
	])
	.meta({
		id: "UserSideEnum",
		description: "Side of the user",
	});

export type UserSideEnumSchema = typeof UserSideEnumSchema;

export namespace UserSideEnumSchema {
	export type Type = z.infer<UserSideEnumSchema>;
}
