import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingMetricsSchema } from "./schema/ListingMetricsSchema";
import { listingMetricsFx } from "./service/listingMetricsFx";

const ListingMetricsPAramsSchema = z
	.object({
		id: z.string().openapi({
			description: "Listing identifier",
		}),
	})
	.openapi("ListingScoreParams", {
		description: "What we need to fetch listing score",
	});

export const withListingMetricsFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing not found",
				},
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingMetricsFx({
					database: c.get("database"),
					listingId: c.req.valid("param").id,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(metrics) {
						return Effect.succeed(c.json<ListingMetricsSchema.Type, 200>(metrics, 200));
					},
					onFailure(e) {
						return Effect.succeed(
							match(e)
								.with(
									{
										_tag: "NotFoundError",
									},
									() => {
										return c.json<MessageSchema.Type, 404>(
											{
												type: "error",
												message: e.message,
											},
											404,
										);
									},
								)
								.exhaustive(),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
