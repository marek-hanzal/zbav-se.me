import z from "zod";
import { DraftPatchSchema } from "~/seller/draft/server/schema/DraftPatchSchema";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const DraftToolPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...DraftPatchSchema.shape.patch.shape,
				usedAt: z.iso.datetime().nullable().meta({
					description: "Timestamp when the draft was used to create a listing",
				}),
			})
			.strip(),
		query: DraftToolQuerySchema,
	})
	.strip();

export type DraftToolPatchSchema = typeof DraftToolPatchSchema;

export namespace DraftToolPatchSchema {
	export type Type = z.infer<DraftToolPatchSchema>;
}
