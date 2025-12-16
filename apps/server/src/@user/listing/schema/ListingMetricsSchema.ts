import { z } from "@hono/zod-openapi";

export const ListingMetricsSchema = z
	.object({
		listing: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Number of views from the feed (low attention score)",
			}),
		listingScore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Overall score gained from listing interactions",
			}),
		views: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Number of views from the listing",
			}),
		viewsScore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Overall score gained from views",
			}),
		favourite: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Number of items added to favourites",
			}),
		favouriteScore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Overall score gained from favourite interactions",
			}),
		ignore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Number of items ignored",
			}),
		ignoreScore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Overall score gained from ignore interactions",
			}),
		flag: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Number of items flagged",
			}),
		flagScore: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Overall score gained from flag interactions",
			}),
		score: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Raw score of the listing",
			}),
	})
	.openapi("ListingMetrics", {
		description: "Score data for the listing",
	});

export type ListingMetricsSchema = typeof ListingMetricsSchema;

export namespace ListingMetricsSchema {
	export type Type = z.infer<ListingMetricsSchema>;
}
