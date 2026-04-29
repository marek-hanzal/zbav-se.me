import { z } from "zod";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

export const ListingPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				title: TitleSchema.optional(),
				categoryId: z.string().min(1).optional(),
				locationId: z.string().min(1).optional(),
				restriction: RestrictionEnumSchema.nullish(),
			})
			.strip(),
		query: ListingQuerySchema,
	})
	.strip();

export type ListingPatchSchema = typeof ListingPatchSchema;

export namespace ListingPatchSchema {
	export type Type = z.infer<ListingPatchSchema>;
}
