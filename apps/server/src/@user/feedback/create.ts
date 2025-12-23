import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { feedbackCreateFx } from "./fx/feedbackCreateFx";
import { FeedbackCreateSchema } from "./schema/FeedbackCreateSchema";

export const withCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/feedback/create",
			description: "Create a new feedback",
			operationId: "apiFeedbackCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedbackCreateSchema,
						},
					},
					description: "Data for creating a new feedback",
				},
			},
			responses: {
				201: {
					description: "The feedback was created",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request - duplicate feedback or invalid data",
				},
			},
			tags: [
				"feedback",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* feedbackCreateFx(c.req.valid("json"));

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
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
