import { createRoute, z } from "@hono/zod-openapi";
import { EntitySchema, zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { listingCollectionFx } from "~/app/listing/fx/listingCollectionFx";
import { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: EntitySchema,
	type: "ListingCollection",
	description: "Collection of listings",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/collection",
			description: "Returns listings based on provided parameters",
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
				"listing",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<EntitySchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: listingCollectionFx({
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
				KyselyContextProvider(c.get("kysely")),
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
