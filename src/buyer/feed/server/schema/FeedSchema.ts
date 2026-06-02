import { z } from "zod";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";
import { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

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
