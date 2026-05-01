import { z } from "zod";
import { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";
import { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const FeedSchema = z
	.looseObject({
		...FeedTableSchema.shape,
		query: ListingQuerySchema.pick({
			filter: true,
			meta: true,
			sort: true,
		}).meta({
			id: "FeedListingQuery",
			description: "A query usable directly with Listing domain (fetch, collection, ...)",
		}),
		upload: UploadSchema.nullable().meta({
			description: "Hero banner for this feed",
		}),
	})
	.omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.strip()
	.meta({
		id: "Feed",
		description: "Feed data",
	});

export type FeedSchema = typeof FeedSchema;

export namespace FeedSchema {
	export type Type = z.infer<FeedSchema>;
}
