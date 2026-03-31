import { z } from "zod";
import { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";

export const ThumbTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the thumb entry",
		}),
		userId: z.string().meta({
			description: "ID of the user who provided the thumb",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		type: ThumbEnumSchema,
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ThumbTable",
		description: "Database row for a thumb action.",
	})
	.strip();

export type ThumbTableSchema = typeof ThumbTableSchema;

export namespace ThumbTableSchema {
	export type Type = z.infer<ThumbTableSchema>;
}
