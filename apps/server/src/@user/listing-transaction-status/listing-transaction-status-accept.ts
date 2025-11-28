import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { ListingTransactionContextProvider } from "~/@user/listing-transaction/fx/ListingTransactionContextFx";
import { listingTransactionStatusAcceptFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusAcceptFx";
import { ListingTransactionStatusSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { ListingTransactionStatusAcceptSchema } from "./schema/ListingTransactionStatusAcceptSchema";

export const withListingTransactionStatusAcceptApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/status/accept",
			description: "Accept a listing transaction. Requires access to the transaction.",
			operationId: "apiListingTransactionStatusAccept",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionStatusAcceptSchema,
						},
					},
					description: "Query object for listing transaction access validation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionStatusSchema,
						},
					},
					description: "Accepted status created",
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
					description: "Listing transaction not found or not accessible",
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
				"listing-transaction-status",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<ListingTransactionStatusSchema.Type, 200>(
					yield* listingTransactionStatusAcceptFx(c.req.valid("json")),
					200,
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
