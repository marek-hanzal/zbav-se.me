import { z } from "@hono/zod-openapi";

export const ListingMetricsSchema = z
	.object({
		listing: z.coerce.number().nullable().openapi({
			description: "Number of views from the feed (low attention score)",
		}),
		listingScore: z.coerce.number().nullable().openapi({
			description: "Overall score gained from listing interactions",
		}),
		views: z.coerce.number().nullable().openapi({
			description: "Number of views from the listing",
		}),
		viewsScore: z.coerce.number().nullable().openapi({
			description: "Overall score gained from views",
		}),
		cart: z.coerce.number().nullable().openapi({
			description: "Number of items added to the cart",
		}),
		cartScore: z.coerce.number().nullable().openapi({
			description: "Overall score gained from cart interactions",
		}),
		ignore: z.coerce.number().nullable().openapi({
			description: "Number of items ignored",
		}),
		ignoreScore: z.coerce.number().nullable().openapi({
			description: "Overall score gained from ignore interactions",
		}),
		flag: z.coerce.number().nullable().openapi({
			description: "Number of items flagged",
		}),
		flagScore: z.coerce.number().nullable().openapi({
			description: "Overall score gained from flag interactions",
		}),
		score: z.coerce.number().nullable().openapi({
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
