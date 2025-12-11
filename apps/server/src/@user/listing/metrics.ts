import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { listingMetricsFx } from "./fx/listingMetricsFx";
import { ListingMetricsSchema } from "./schema/ListingMetricsSchema";

const ListingMetricsPAramsSchema = z
	.object({
		id: z.string().openapi({
			description: "Listing identifier",
		}),
	})
	.openapi("ListingScoreParams", {
		description: "What we need to fetch listing score",
	});

export const withMetricsApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "get",
			path: "/listing/{id}/metrics",
			description: "Return score for a listing",
			operationId: "apiListingMetricsFetch",
			request: {
				params: ListingMetricsPAramsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingMetricsSchema,
						},
					},
					description: "Listing score for the provided identifier",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"listing",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<ListingMetricsSchema.Type, 200>(
					yield* listingMetricsFx({
						listingId: c.req.valid("param").id,
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
