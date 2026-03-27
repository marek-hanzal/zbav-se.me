import { z } from "@hono/zod-openapi";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const FeedTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the feed",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the feed",
		}),
		locationId: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "ID of the location associated with the feed",
			}),
		uploadId: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description:
					"Hero image for this feed (usually selected from the listings in the feed)",
			}),
		type: FeedTypeEnumSchema.openapi({
			description: "Type of the feed",
		}),
		//
		name: z.string().openapi({
			description: "Name of the feed",
		}),
		query: z.looseObject({}),
		//
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().openapi({
			description: "Last update timestamp, used to sort the feed selection",
			type: "string",
		}),
	})
	.strip();

export type FeedTableSchema = typeof FeedTableSchema;

export namespace FeedTableSchema {
	export type Type = z.infer<FeedTableSchema>;
}
