import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const UserRestrictionWhereSchema = z
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
		id: "UserRestrictionWhere",
		description: "App-based user restriction filters",
	});

export type UserRestrictionWhereSchema = typeof UserRestrictionWhereSchema;

export namespace UserRestrictionWhereSchema {
	export type Type = z.infer<UserRestrictionWhereSchema>;
}
