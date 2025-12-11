import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { ListingTransactionSchema } from "~/@user/listing-transaction/schema/ListingTransactionSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { ListingTransactionContextProvider } from "./fx/ListingTransactionContextFx";
import { listingTransactionCreateFx } from "./fx/listingTransactionCreateFx";
import { ListingTransactionCreateSchema } from "./schema/ListingTransactionCreateSchema";

export const withListingTransactionCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/create",
			description: "Create a new listing transaction",
			operationId: "apiListingTransactionCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionCreateSchema,
						},
					},
					description: "Data for creating a new listing transaction",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingTransactionSchema,
						},
					},
					description: "The listing transaction was created",
				},
				403: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Access denied",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing not found",
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
				return c.json<ListingTransactionSchema.Type, 201>(
					yield* listingTransactionCreateFx(c.req.valid("json")),
					201,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				ListingTransactionContextProvider(),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								() => {
									return c.json<MessageSchema.Type, 403>(
										{
											type: "error",
											message: e.message,
										},
										403,
									);
								},
							),
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
