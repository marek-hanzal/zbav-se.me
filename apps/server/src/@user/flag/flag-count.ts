import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { CountSchema } from "~/schema/CountSchema";
import { MessageSchema } from "~/schema/MessageSchema";
import { flagCountFx } from "./fx/flagCountFx";
import { FlagCountQuerySchema } from "~/app/flag/schema/FlagCountQuerySchema";

export const withFlagCountApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/flag/count",
			description: "Returns count of flag items based on provided query",
			operationId: "apiFlagCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FlagCountQuerySchema,
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
				"flag",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<CountSchema.Type, 200>(
					yield* flagCountFx({
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
