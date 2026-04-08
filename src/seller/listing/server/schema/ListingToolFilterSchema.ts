import { z } from "zod";
import { ListingFilterSchema } from "./ListingFilterSchema";

export const ListingToolFilterSchema = z
	.looseObject({
		...ListingFilterSchema.shape,
	})
	.strip();

export type ListingToolFilterSchema = typeof ListingToolFilterSchema;

export namespace ListingToolFilterSchema {
	export type Type = z.infer<ListingToolFilterSchema>;
}
