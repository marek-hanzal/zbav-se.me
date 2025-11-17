import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import { ListingSchema } from "./schema/ListingSchema";
import { listingCollectionFx } from "./service/listingCollectionFx";

export const withListingCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/collection",
			description: "Returns listings based on provided parameters",
			operationId: "apiListingCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingSchema,
								type: "ListingCollection",
								description: "Collection of listings",
							}),
						},
					},
					description: "Access collection of listings based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const json = c.req.valid("json");
				const user = c.get("user");

				return yield* listingCollectionFx({
					userId: user.id,
					query: json,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(collection) {
						return Effect.succeed(
							c.json<withCollectionSchema.Type<ListingSchema>, 200>(collection, 200),
						);
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
						match(e).exhaustive();

						return Effect.succeed(
							c.json<MessageSchema.Type, 500>(
								{
									type: "error",
									message: "This should not happen",
								},
								500,
							),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
