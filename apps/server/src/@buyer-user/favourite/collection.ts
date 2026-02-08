import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { favouriteCollectionFx } from "~/@buyer-user/favourite/fx/favouriteCollectionFx";
import { FavouriteItemSchema } from "~/@buyer-user/favourite/schema/FavouriteItemSchema";
import { FavouriteQuerySchema } from "~/@buyer-user/favourite/schema/FavouriteQuerySchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: FavouriteItemSchema,
	type: "FavouriteItemSchema",
	description: "Collection of favourite items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;

	buyerUserHono.openapi(
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
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFavouriteCollection",
					userId: user.id,
				});

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
				Effect.tap(() => Effect.log("apiFavouriteCollection")),
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
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
