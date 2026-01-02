import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { userEventSellerInfoFx } from "./fx/userEventSellerInfoFx";
import { UserEventSellerSchema } from "./schema/UserEventSellerSchema";

const UserEventSellerParamsSchema = z
	.object({
		userId: z.string().openapi({
			description: "ID of the user",
		}),
	})
	.openapi("UserEventSellerParams", {
		description: "Parameters for user event seller info",
	});

export const withSellerApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/user-event/{userId}/seller",
			description: "Return seller info for a user event.",
			operationId: "apiUserEventSeller",
			request: {
				params: UserEventSellerParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z
								.xor([
									z.null(),
									UserEventSellerSchema,
								])
								.openapi({
									description:
										"Seller info may not be available if we don't have enough data",
								}),
						},
					},
					description: "Seller info",
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

				return c.json<UserEventSellerSchema.Type | null, 200>(
					yield* userEventSellerInfoFx({
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
