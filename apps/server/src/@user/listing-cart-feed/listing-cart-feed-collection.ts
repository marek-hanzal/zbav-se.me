import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { FeedQuerySchema } from "~/@user/feed/schema/FeedQuerySchema";
import { listingCartFeedCollectionFx } from "~/@user/listing-cart-feed/fx/listingCartFeedCollectionFx";
import { ListingCartFeedSchema } from "~/@user/listing-cart-feed/schema/ListingCartFeedSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

export const withListingCartFeedCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-cart-feed/collection",
			description: "Returns feed items from listing cart based on provided parameters",
			operationId: "apiListingCartFeedCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingCartFeedSchema,
								type: "ListingCartFeedCollection",
								description: "Collection of feed items from listing cart",
							}),
						},
					},
					description:
						"Access collection of feed items from listing cart based on provided query",
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
				"listing-cart-feed",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingCartFeedSchema>, 200>(
					yield* listingCartFeedCollectionFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
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
