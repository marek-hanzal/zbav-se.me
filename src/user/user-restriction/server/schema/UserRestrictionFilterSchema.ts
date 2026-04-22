import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const UserRestrictionFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		restriction: RestrictionEnumSchema.optional().meta({
			description: "This filter matches rows containing the restriction level",
		}),
		availableAtGte: z.coerce.date().optional().meta({
			description: "Lower availableAt bound",
		}),
		availableAtLte: z.coerce.date().optional().meta({
			description: "Upper availableAt bound",
		}),
		isAvailable: z.boolean().optional().meta({
			description: "Filter out only available items",
		}),
		expiresAtGte: z.coerce.date().optional().meta({
			description: "Lower expiresAt bound",
		}),
		expiresAtLte: z.coerce.date().optional().meta({
			description: "Upper expiresAt bound",
		}),
		expiresAtIsNull: z.boolean().optional().meta({
			description:
				"When explicit true/false controls if is/is not null is checked on 'expiresAt' field.",
		}),
		isExpired: z.boolean().optional().meta({
			description: "Filter restriction rows by whether expiresAt is already in the past.",
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
