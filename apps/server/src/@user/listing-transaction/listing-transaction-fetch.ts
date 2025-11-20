import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingTransactionFetchFx } from "./fx/listingTransactionFetchFx";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";

export const withListingTransactionFetchApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/fetch",
			description: "Return a listing transaction based on the provided query",
			operationId: "apiListingTransactionFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionQuerySchema,
						},
					},
					description: "Query object for listing transaction fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionSchema,
						},
					},
					description: "Listing transaction matching provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing transaction not found",
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
				"listing-transaction",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<ListingTransactionSchema.Type, 200>(
					yield* listingTransactionFetchFx({
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
							),
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
