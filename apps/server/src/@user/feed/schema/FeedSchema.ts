import { z } from "@hono/zod-openapi";
import { ListingQuerySchema } from "~/@session/listing/schema/ListingQuerySchema";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { FeedTableSchema } from "~/database/@table/FeedTableSchema";

export const FeedSchema = z
	.looseObject({
		...FeedTableSchema.shape,
		query: ListingQuerySchema,
		upload: z
			.union([
				UploadSchema,
				z.null(),
			])
			.openapi({
				description: "Hero banner for this feed",
			}),
	})
	.omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.strip()
	.openapi("Feed", {
		description: "Feed data",
	});

export type FeedSchema = typeof FeedSchema;

export namespace FeedSchema {
	export type Type = z.infer<FeedSchema>;
}
