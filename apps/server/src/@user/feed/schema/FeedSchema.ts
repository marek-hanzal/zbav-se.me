import { z } from "@hono/zod-openapi";
import { FeedDbSchema } from "../../../app/feed/schema/FeedDbSchema";

export const FeedSchema = z
	.object({
		...FeedDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.openapi("Feed", {
		description: "Feed data",
	});

export type FeedSchema = typeof FeedSchema;

export namespace FeedSchema {
	export type Type = z.infer<FeedSchema>;
}
