import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { userEventSellerInfoFx } from "~/app/user-event/fx/userEventSellerInfoFx";
import { UserEventSellerSchema } from "~/app/user-event/schema/UserEventSellerSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";

const UserEventSellerParamsSchema = z
	.object({
		userId: z.string().openapi({
			description: "ID of the user",
		}),
	})
	.openapi("UserEventSellerParams", {
		description: "Parameters for user event seller info",
	});

export const withSellerApiFx = Effect.fn("withSellerApiFx")(function* () {
	const { sessionHono } = yield* RoutesContextFx;

	sessionHono.openapi(
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
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const { userId } = c.req.valid("param");

				return c.json<UserEventSellerSchema.Type | null, 200>(
					yield* zodFx({
						schema: UserEventSellerSchema,
						dataFx: userEventSellerInfoFx({
							userId,
						}),
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
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
});
