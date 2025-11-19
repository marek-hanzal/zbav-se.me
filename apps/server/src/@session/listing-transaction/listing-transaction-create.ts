import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { ConfigContextProvider } from "../../database/fx/ConfigContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingTransactionCreateFx } from "./fx/listingTransactionCreateFx";
import { ListingTransactionCreateSchema } from "./schema/ListingTransactionCreateSchema";

export const withListingTransactionCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
					description: "The listing transaction was created",
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
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* listingTransactionCreateFx(c.req.valid("json"));

				return c.body(null, 201);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				ConfigContextProvider({
					listingTransactionExpiresAt: 3,
				}),
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
