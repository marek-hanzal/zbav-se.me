import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";

export const UserRestrictionFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		restriction: CategoryRestrictionEnumSchema.optional().meta({
			description: "This filter matches rows containing the restriction level",
		}),
		availableAtGte: z.coerce.date().optional().meta({
			description: "Lower availableAt bound",
			type: "string",
		}),
		availableAtLte: z.coerce.date().optional().meta({
			description: "Upper availableAt bound",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "UserRestrictionFilter",
		description: "Filter object for user restrictions",
	});

export type UserRestrictionFilterSchema = typeof UserRestrictionFilterSchema;

export namespace UserRestrictionFilterSchema {
	export type Type = z.infer<UserRestrictionFilterSchema>;
}
