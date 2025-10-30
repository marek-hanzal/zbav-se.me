import { z } from "@hono/zod-openapi";
import { FeedSchema } from "./FeedSchema";

export const FeedDtoSchema = z
	.object({
		...FeedSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.openapi("FeedDto", {
		description: "Feed data transfer object",
	});

export type FeedDtoSchema = typeof FeedDtoSchema;

export namespace FeedDtoSchema {
	export type Type = z.infer<FeedDtoSchema>;
}
