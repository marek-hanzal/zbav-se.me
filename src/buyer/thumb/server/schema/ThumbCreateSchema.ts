import { z } from "zod";
import { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";

export const ThumbCreateSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		type: ThumbEnumSchema,
	})
	.strip()
	.meta({
		id: "ThumbCreate",
		description: "Data for creating a new thumb",
	});

export type ThumbCreateSchema = typeof ThumbCreateSchema;

export namespace ThumbCreateSchema {
	export type Type = z.infer<ThumbCreateSchema>;
}
