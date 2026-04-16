import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const DraftFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches drafts with the exact userId",
		}),
		updatedAtGte: z.coerce.date().optional().meta({
			description:
				"This filter matches drafts with updatedAt greater than or equal to the provided date",
		}),
		updatedAtLte: z.coerce.date().optional().meta({
			description:
				"This filter matches drafts with updatedAt less than or equal to the provided date",
		}),
		usedAtIsNull: z.boolean().optional().meta({
			description:
				"This filter matches drafts where usedAt is null (true) or not null (false)",
		}),
	})
	.strip()
	.meta({
		id: "DraftFilter",
		description: "User-land filters",
	});

export type DraftFilterSchema = typeof DraftFilterSchema;

export namespace DraftFilterSchema {
	export type Type = z.infer<DraftFilterSchema>;
}
