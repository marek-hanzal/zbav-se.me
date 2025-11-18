import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingIgnoreQuerySchema } from "./schema/ListingIgnoreQuerySchema";
import { ListingIgnoreSchema } from "./schema/ListingIgnoreSchema";
import { listingIgnoreCollectionFx } from "./service/listingIgnoreCollectionFx";

export const withListingIgnoreCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-ignore/collection",
			description: "Returns listing ignore items based on provided parameters",
			operationId: "apiListingIgnoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingIgnoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingIgnoreSchema,
								type: "ListingIgnoreCollection",
								description: "Collection of listing ignore items",
							}),
						},
					},
					description:
						"Access collection of listing ignore items based on provided query",
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
				"listing-ignore",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingIgnoreCollectionFx({
					database: c.get("database"),
					userId: c.get("user").id,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(collection) {
						return Effect.succeed(
							c.json<withCollectionSchema.Type<ListingIgnoreSchema>, 200>(
								collection,
								200,
							),
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
