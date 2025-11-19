import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
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
					return Effect.succeed(
						Match.value(e).pipe(
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
