import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { ListingScoreContextProvider } from "./fx/ListingScoreContextFx";
import { listingScoreCreateFx } from "./fx/listingScoreCreateFx";
import { ListingScoreCreateSchema } from "./schema/ListingScoreCreateSchema";

export const withCreateApi: Routes.Fn = ({ userHono }) => {
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
							schema: NoticeSchema,
						},
					},
					description: "Cannot score your own listing",
				},
				429: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Too many requests - please wait between scores",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
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
									return c.json<NoticeSchema.Type, 400>(
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
									return c.json<NoticeSchema.Type, 404>(
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
									return c.json<NoticeSchema.Type, 429>(
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
									return c.json<NoticeSchema.Type, 500>(
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
