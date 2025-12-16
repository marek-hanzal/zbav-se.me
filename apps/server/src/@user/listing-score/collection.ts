import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { ListingScoreQuerySchema } from "~/app/listing-score/schema/ListingScoreQuerySchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { listingScoreCollectionFx } from "./fx/listingScoreCollectionFx";
import { ListingScoreSchema } from "./schema/ListingScoreSchema";

export const withCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/collection",
			description: "Returns listing scores based on provided parameters",
			operationId: "apiListingScoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingScoreSchema,
								type: "ListingScoreCollection",
								description: "Collection of listing scores",
							}),
						},
					},
					description: "Access collection of listing scores based on provided query",
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
				"listing-score",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingScoreSchema>, 200>(
					yield* listingScoreCollectionFx(c.req.valid("json")),
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
