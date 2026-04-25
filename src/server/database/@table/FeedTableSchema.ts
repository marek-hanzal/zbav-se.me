import { z } from "zod";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const FeedTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the feed",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the feed",
		}),
		uploadId: z.string().nullish().meta({
			description:
				"Hero image for this feed (usually selected from the listings in the feed)",
		}),
		type: FeedTypeEnumSchema,
		//
		name: z.string().meta({
			description: "Name of the feed",
		}),
		query: z.looseObject({}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp, used to sort the feed selection",
			type: "string",
		}),
	})
	.meta({
		id: "FeedTable",
		description: "Database row for a feed.",
	})
	.strip();

export type FeedTableSchema = typeof FeedTableSchema;

export namespace FeedTableSchema {
	export type Type = z.infer<FeedTableSchema>;
}
