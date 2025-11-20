import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingScoreContextProvider } from "./fx/ListingScoreContextFx";
import { listingScoreCreateFx } from "./fx/listingScoreCreateFx";
import { ListingScoreCreateSchema } from "./schema/ListingScoreCreateSchema";

export const withListingScoreCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
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
					description: "Too many requests - please wait between scores",
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
				"listing-score",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* listingScoreCreateFx(c.req.valid("json"));

				return c.body(null, 201);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				ListingScoreContextProvider(),
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
									_tag: "TooManyRequests",
								},
								() => {
									return c.json<MessageSchema.Type, 429>(
										{
											type: "error",
											message: e.message,
										},
										429,
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
