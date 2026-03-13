import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";
import { feedFavouriteFetchFx } from "~/@buyer/feed-favourite/fx/feedFavouriteFetchFx";
import { FeedFavouriteSchema } from "~/@buyer/feed-favourite/schema/FeedFavouriteSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { buyerHono } = yield* RoutesContextFx;
	buyerHono.openapi(
		createRoute({
			method: "post",
			path: "/feed-favourite/fetch",
			description: "Return a feed favourite based on the provided query",
			operationId: "apiFeedFavouriteFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed favourite fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedFavouriteSchema,
						},
					},
					description: "Return a feed favourite based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Feed favourite not found",
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
				"Feed Favourite",
			],
			summary: "Fetch a feed favourite based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: FeedFavouriteSchema,
						dataFx: feedFavouriteFetchFx({
							...c.req.valid("json"),
							userId: user.id,
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
