import { z } from "zod";
import { ListingQuerySchema } from "~/server/@buyer/listing/schema/ListingQuerySchema";
import { UploadSchema } from "~/server/@user/upload/schema/UploadSchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";

export const FeedSchema = z
	.looseObject({
		...FeedTableSchema.shape,
		query: ListingQuerySchema,
		upload: z
			.union([
				z.null(),
				UploadSchema,
			])
			.meta({
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
