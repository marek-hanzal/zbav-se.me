import { z } from "zod";
import { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const FeedCreateSchema = z
	.looseObject({
		type: FeedTypeEnumSchema,
		name: z.string().min(1).meta({
			description: "Name of the feed",
		}),
		query: ListingQuerySchema,
	})
	.strip()
	.meta({
		id: "FeedCreate",
		description: "Data for creating a new feed",
	});

export type FeedCreateSchema = typeof FeedCreateSchema;

export namespace FeedCreateSchema {
	export type Type = z.infer<FeedCreateSchema>;
}
