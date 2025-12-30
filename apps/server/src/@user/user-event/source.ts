import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { userEventSourceFx } from "./fx/userEventSourceFx";
import { UserEventSourceQuerySchema } from "./schema/UserEventSourceQuerySchema";
import { UserEventSourceResponseSchema } from "./schema/UserEventSourceResponseSchema";

export const withSourceApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "get",
			path: "/user-event/source",
			description:
				"Retrieves raw user event data for post-processing to compute various user-related behavioral metrics",
			operationId: "apiUserEventSource",
			request: {
				query: UserEventSourceQuerySchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserEventSourceResponseSchema,
						},
					},
					description: "User event data",
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
				"user-event",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const { userid } = c.req.valid("query");

				return c.json<UserEventSourceResponseSchema.Type, 200>(
					yield* userEventSourceFx({
						userId: userid,
						cutoff: 90,
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
