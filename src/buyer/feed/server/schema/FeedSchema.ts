import { z } from "zod";
import { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { ListingWhereSchema } from "~/buyer/listing/server/schema/ListingWhereSchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";
import { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const FeedSchema = z
	.looseObject({
		...FeedTableSchema.shape,
		query: z
			.looseObject({
				...ListingQuerySchema.pick({
					filter: true,
					attrs: true,
					meta: true,
					sort: true,
				}).shape,
				filter: ListingWhereSchema.omit({
					id: true,
					idIn: true,
					categoryIdIn: true,
					userId: true,
				}).optional(),
			})
			.strip()
			.meta({
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
