import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { listingEventCreateFx } from "./fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "./schema/ListingEventCreateSchema";

export const withCreateApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-event/create",
			description: "Create a new listing event",
			operationId: "apiListingEventCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingEventCreateSchema,
						},
					},
					description: "Data for creating a new listing event",
				},
			},
			responses: {
				201: {
					description: "The listing event was created",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Cannot create event on your own listing",
				},
				429: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Too many requests - please wait between events",
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
				"listing-event",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* listingEventCreateFx(c.req.valid("json"));

				return c.body(null, 201);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
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
									_tag: "NotFoundErrorFx",
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
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
