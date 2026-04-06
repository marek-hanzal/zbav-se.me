import { z } from "zod";
import { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";

export const DraftToolFilterSchema = z
	.looseObject({
		...DraftFilterSchema.shape,
		updatedAtGte: z.iso.datetime().optional().meta({
			description:
				"This filter matches drafts with updatedAt greater than or equal to the provided date",
		}),
		updatedAtLte: z.iso.datetime().optional().meta({
			description:
				"This filter matches drafts with updatedAt less than or equal to the provided date",
		}),
	})
	.strip();

export type DraftToolFilterSchema = typeof DraftToolFilterSchema;

export namespace DraftToolFilterSchema {
	export type Type = z.infer<DraftToolFilterSchema>;
}
