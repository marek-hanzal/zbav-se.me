import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { listingCollectionFx } from "~/@seller-user/listing/fx/listingCollectionFx";
import { ListingItemSchema } from "~/@seller-user/listing/schema/ListingItemSchema";
import { ListingQuerySchema } from "~/@seller-user/listing/schema/ListingQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: ListingItemSchema,
	type: "ListingItemSchema",
	description: "Collection of listings",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;
	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/collection",
			description: "Returns the authenticated seller's listings based on provided query",
			operationId: "apiListingCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
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
					description: "Access collection of listings based on provided query",
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
				"Listing",
			],
			summary: "Fetch a collection of listings based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<ListingItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: listingCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<ListingItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => c.json(noticeZodError(zod), 500),
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
