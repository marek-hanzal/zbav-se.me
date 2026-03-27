import { z } from "zod";
import { ListingQuerySchema } from "~/@buyer/listing/server/schema/ListingQuerySchema";
import { UploadSchema } from "~/@user/upload/server/schema/UploadSchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";

export const FeedSchema = z
	.looseObject({
		...FeedTableSchema.shape,
		query: ListingQuerySchema,
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
