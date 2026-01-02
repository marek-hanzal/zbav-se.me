import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { userEventBuyerInfoFx } from "./fx/userEventBuyerInfoFx";
import { UserEventBuyerSchema } from "./schema/UserEventBuyerSchema";

const UserEventBuyerParamsSchema = z
	.object({
		userId: z.string().openapi({
			description: "ID of the user",
		}),
	})
	.openapi("UserEventBuyerParams", {
		description: "Parameters for user event buyer info",
	});

export const withBuyerApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/user-event/{userId}/buyer",
			description: "Return buyer info for a user event.",
			operationId: "apiUserEventBuyer",
			request: {
				params: UserEventBuyerParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserEventBuyerSchema,
						},
					},
					description: "Buyer info",
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
				const { userId } = c.req.valid("param");

				return c.json<UserEventBuyerSchema.Type, 200>(
					yield* userEventBuyerInfoFx({
						userId,
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
