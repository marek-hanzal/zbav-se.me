import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../fx/DatabaseContextFx";
import { UserContextProvider } from "../../fx/UserContextFx";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingIgnoreCountFx } from "./fx/listingIgnoreCountFx";
import { ListingIgnoreCountQuerySchema } from "./schema/ListingIgnoreCountQuerySchema";

export const withListingIgnoreCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-ignore/count",
			description: "Returns count of listing ignore items based on provided query",
			operationId: "apiListingIgnoreCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingIgnoreCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
				"listing-ignore",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<CountSchema.Type, 200>(
					yield* listingIgnoreCountFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "This should not happen",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
