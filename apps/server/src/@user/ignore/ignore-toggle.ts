import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { ListingScoreContextProvider } from "../listing-score/fx/ListingScoreContextFx";
import { ignoreToggleFx } from "./fx/ignoreToggleFx";
import { IgnoreToggleSchema } from "./schema/IgnoreToggleSchema";

export const withIgnoreToggleApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/ignore/toggle",
			description: "Toggle ignore state (add or remove)",
			operationId: "apiIgnoreToggle",
			request: {
				body: {
					content: {
						"application/json": {
							schema: IgnoreToggleSchema,
						},
					},
				},
			},
			responses: {
				204: {
					description: "Nothing to say, we're just happy",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Invalid request",
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
				"ignore",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* ignoreToggleFx({
					data: c.req.valid("json"),
				});

				return c.body(null, 204);
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
