import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { favouriteCollectionFx } from "~/@buyer/favourite/fx/favouriteCollectionFx";
import { FavouriteItemSchema } from "~/@buyer/favourite/schema/FavouriteItemSchema";
import { FavouriteQuerySchema } from "~/@buyer/favourite/schema/FavouriteQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(FavouriteItemSchema);

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { buyerHono } = yield* RoutesContextFx;

	buyerHono.openapi(
		createRoute({
			method: "post",
			path: "/favourite/collection",
			description: "Returns favourite items based on provided parameters",
			operationId: "apiFavouriteCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FavouriteQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of favourite items based on provided query",
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
				"Favourite",
			],
			summary: "Fetch a collection of favourite items based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: favouriteCollectionFx({
							...c.req.valid("json"),
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
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
