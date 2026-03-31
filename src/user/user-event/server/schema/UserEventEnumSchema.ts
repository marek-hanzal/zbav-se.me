import { z } from "zod";

export const UserEventEnumSchema = z
	.enum([
		"like",
		"dislike",
		"listing.create",
		"transaction.create",
		"transaction.open",
		"transaction.rejected",
		"transaction.closed",
		"transaction.message",
		"transaction.success",
		"transaction.expired",
		"transaction.resolved",
	])
	.meta({
		id: "UserEventEnum",
		description: "Type of user event",
	});

export type UserEventEnumSchema = typeof UserEventEnumSchema;

export namespace UserEventEnumSchema {
	export type Type = z.infer<UserEventEnumSchema>;
}
