import { z } from "zod";

export const ListingValidateSchema = z
	.looseObject({
		draftId: z.string().min(1),
	})
	.strip();

export type ListingValidateSchema = typeof ListingValidateSchema;

export namespace ListingValidateSchema {
	export type Type = z.infer<ListingValidateSchema>;
}
