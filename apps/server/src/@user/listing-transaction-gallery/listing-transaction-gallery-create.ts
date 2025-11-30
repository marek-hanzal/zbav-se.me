import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { ListingTransactionContextProvider } from "~/@user/listing-transaction/fx/ListingTransactionContextFx";
import { listingTransactionGalleryCreateFx } from "~/@user/listing-transaction-gallery/fx/listingTransactionGalleryCreateFx";
import { ListingTransactionGallerySchema } from "~/@user/listing-transaction-gallery/schema/ListingTransactionGallerySchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { ListingTransactionGalleryCreateSchema } from "./schema/ListingTransactionGalleryCreateSchema";

export const withListingTransactionGalleryCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/gallery/create",
			description:
				"Create a gallery for a listing transaction. Requires access to the transaction.",
			operationId: "apiListingTransactionGalleryCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionGalleryCreateSchema,
						},
					},
					description: "Query object for listing transaction gallery creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionGallerySchema,
						},
					},
					description: "Gallery created",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Invalid request",
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
				"listing-transaction-gallery",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<ListingTransactionGallerySchema.Type, 200>(
					yield* listingTransactionGalleryCreateFx(c.req.valid("json")),
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
									_tag: "InvalidRequestError",
								},
								() => {
									return c.json<MessageSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
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
									_tag: "RuntimeError",
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
