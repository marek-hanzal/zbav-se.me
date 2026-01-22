import { z } from "@hono/zod-openapi";

export const FeedDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the feed",
	}),
	userId: z.string().openapi({
		description: "ID of the user who created the feed",
	}),
	locationId: z
		.union([
			z.string(),
			z.null(),
		])
		.openapi({
			description: "ID of the location associated with the feed",
		}),
	uploadId: z
		.union([
			z.string(),
			z.null(),
		])
		.openapi({
			description:
				"Hero image for this feed (usually selected from the listings in the feed)",
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
});

export type FeedDbSchema = typeof FeedDbSchema;

export namespace FeedDbSchema {
	export type Type = z.infer<FeedDbSchema>;
}
