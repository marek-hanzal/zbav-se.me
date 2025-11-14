import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingTransactionCreateSchema } from "./schema/ListingTransactionCreateSchema";
import { createListingTransactionFx } from "./service/createListingTransactionFx";

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
					description: "Failed to create transaction",
				},
			},
			tags: [
				"listing-transaction",
				"session",
			],
		}),
		async (c) => {
			const request = c.req.valid("json");

			return Effect.runPromise(
				createListingTransactionFx({
					database: database.kysely,
					userId: c.get("user").id,
					...request,
				}).pipe(
					Effect.matchEffect({
						onSuccess() {
							return Effect.succeed(c.body(null, 201));
						},
						onFailure: (e) =>
							match(e)
								.with(
									{
										_tag: "InfraError",
									},
									(error) =>
										Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: error.message,
												},
												500,
											),
										),
								)
								.with(
									{
										_tag: "NotFoundError",
									},
									(error) =>
										Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: error.message,
												},
												404,
											),
										),
								)
								.exhaustive(),
					}),
				),
			);
		},
	);
};
