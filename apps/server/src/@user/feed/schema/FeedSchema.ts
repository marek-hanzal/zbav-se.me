import { z } from "@hono/zod-openapi";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { FeedDbSchema } from "~/app/feed/schema/FeedDbSchema";
import { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";

export const FeedSchema = z
	.looseObject({
		...FeedDbSchema.shape,
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
