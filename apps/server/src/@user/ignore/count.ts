import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { ignoreCountFx } from "~/app/ignore/fx/ignoreCountFx";
import { IgnoreCountQuerySchema } from "~/app/ignore/schema/IgnoreCountQuerySchema";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { CountSchema } from "~/schema/CountSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/ignore/count",
			description: "Returns count of ignore items based on provided query",
			operationId: "apiIgnoreCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: IgnoreCountQuerySchema,
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
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"ignore",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = yield* UserContextFx;

				return c.json<CountSchema.Type, 200>(
					yield* ignoreCountFx({
						...c.req.valid("json"),
						scope: {
							userId: user.id,
						},
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
									_tag: "ZodErrorFx",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: err.message,
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
