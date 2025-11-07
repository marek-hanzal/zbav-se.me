import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingScoreCreateSchema } from "./schema/ListingScoreCreateSchema";
import { createListingScoreFx } from "./service/createListingScoreFx";

export const withListingScoreCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/create",
			description: "Create a new listing score",
			operationId: "apiListingScoreCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreCreateSchema,
						},
					},
					description: "Data for creating a new listing score",
				},
			},
			responses: {
				201: {
					description: "The listing score was created",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Cannot score your own listing",
				},
				429: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description:
						"Too many requests - please wait between scores",
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
				"listing-score",
				"session",
			],
		}),
		async (c) => {
			const request = c.req.valid("json");

			return Effect.runPromise(
				createListingScoreFx({
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
									(e) => {
										return Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: e.message,
												},
												500,
											),
										);
									},
								)
								.with(
									{
										_tag: "InvalidRequestError",
									},
									(e) => {
										return Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: e.message,
												},
												400,
											),
										);
									},
								)
								.with(
									{
										_tag: "NotFoundError",
									},
									(e) => {
										return Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: e.message,
												},
												404,
											),
										);
									},
								)
								.with(
									{
										_tag: "TooManyRequests",
									},
									(e) => {
										return Effect.succeed(
											c.json<MessageSchema.Type>(
												{
													type: "error",
													message: e.message,
												},
												429,
											),
										);
									},
								)
								.exhaustive(),
					}),
				),
			);
		},
	);
};
