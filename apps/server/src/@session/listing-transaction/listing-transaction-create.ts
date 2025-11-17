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
			},
			tags: [
				"listing-transaction",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const json = c.req.valid("json");
				const user = c.get("user");

				return yield* createListingTransactionFx({
					database: database.kysely,
					userId: user.id,
					...json,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess() {
						return Effect.succeed(c.body(null, 201));
					},
					onFailure(e) {
						return match(e)
							.with(
								{
									_tag: "NotFoundError",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type, 404>(
											{
												type: "error",
												message: e.message,
											},
											404,
										),
									);
								},
							)
							.exhaustive();
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
