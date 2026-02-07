import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { feedPatchFx } from "~/@buyer-user/feed/fx/feedPatchFx";
import { FeedPatchSchema } from "~/@buyer-user/feed/schema/FeedPatchSchema";
import { FeedSchema } from "~/@buyer-user/feed/schema/FeedSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "patch",
			path: "/feed/patch",
			description: "Update an existing feed item",
			operationId: "apiFeedPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedPatchSchema,
						},
					},
					description: "Data for updating a feed item",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The updated feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Feed item not found",
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
				"Feed",
			],
			summary: "Update an existing feed item",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<FeedSchema.Type, 200>(
					yield* zodFx({
						schema: FeedSchema,
						dataFx: feedPatchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<FeedSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				Effect.provide(DateContextLayer(createDateContext())),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
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
