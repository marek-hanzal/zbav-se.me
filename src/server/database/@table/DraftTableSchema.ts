import { z } from "zod";

export const DraftTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the draft",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the draft",
		}),
		//
		galleryId: z.string().meta({
			description: "ID of the gallery",
		}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
		}),
		usedAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the draft was used to create a listing",
		}),
		//
		withImageUrl: z.array(z.string()).meta({
			description:
				"Denormalized ordered public image URLs used for draft gallery previews and list reads",
		}),
		withUploadIds: z.array(z.string()).meta({
			description:
				"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
		}),
	})
	.meta({
		id: "DraftTable",
		description: "Database row for a draft listing.",
	})
	.strip();

export type DraftTableSchema = typeof DraftTableSchema;

export namespace DraftTableSchema {
	export type Type = z.infer<DraftTableSchema>;
}
