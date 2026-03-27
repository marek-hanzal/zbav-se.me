import { z } from "zod";

export const UserEventSourceEnumSchema = z
	.enum([
		"listing",
		"transaction",
	])
	.meta({
		id: "UserEventSourceEnum",
		description: "Source of the user event",
	});

export type UserEventSourceEnumSchema = typeof UserEventSourceEnumSchema;

export namespace UserEventSourceEnumSchema {
	export type Type = z.infer<UserEventSourceEnumSchema>;
}
