import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingTransactionContextProvider } from "./fx/ListingTransactionContextFx";
import { listingTransactionPatchFx } from "./fx/listingTransactionPatchFx";
import { ListingTransactionPatchSchema } from "./schema/ListingTransactionPatchSchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";

export const withListingTransactionPatchApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "patch",
			path: "/listing-transaction/patch",
			description: "Update a listing transaction",
			operationId: "apiListingTransactionPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionPatchSchema,
						},
					},
					description: "Data for updating a listing transaction",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionSchema,
						},
					},
					description: "The listing transaction was updated",
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
				const body = c.req.valid("json");
				return c.json<ListingTransactionSchema.Type, 200>(
					yield* listingTransactionPatchFx({
						transactionId: body.id,
						status: body.status,
						side: body.side,
					}),
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
