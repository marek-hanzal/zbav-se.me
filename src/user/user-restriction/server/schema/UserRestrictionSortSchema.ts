import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const UserRestrictionSortSchema = z
	.looseObject({
		field: z
			.enum([
				"availableAt",
				"createdAt",
				"id",
			])
			.meta({
				id: "UserRestrictionSortField",
				description: "Field of the user restriction sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "UserRestrictionSort",
		description: "Sort object for user restrictions",
	});

export type UserRestrictionSortSchema = typeof UserRestrictionSortSchema;

export namespace UserRestrictionSortSchema {
	export type Type = z.infer<UserRestrictionSortSchema>;
}
