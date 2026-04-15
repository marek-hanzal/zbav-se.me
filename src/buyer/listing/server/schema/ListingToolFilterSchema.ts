import { z } from "zod";
import { ListingFilterSchema } from "./ListingFilterSchema";

export const ListingToolFilterSchema = z
	.looseObject({
		...ListingFilterSchema.shape,
		expiresAtBefore: z.iso.datetime().optional().meta({
			description: "This filter matches listings that expire before the provided date",
			type: "string",
		}),
		expiresAtAfter: z.iso.datetime().optional().meta({
			description: "This filter matches listings that expire after the provided date",
			type: "string",
		}),
	})
	.omit({
		userId: true,
		idIn: true,
	})
	.strip();

export type ListingToolFilterSchema = typeof ListingToolFilterSchema;

export namespace ListingToolFilterSchema {
	export type Type = z.infer<ListingToolFilterSchema>;
}
