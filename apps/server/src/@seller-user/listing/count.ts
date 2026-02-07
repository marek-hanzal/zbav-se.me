import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { listingCountFx } from "~/@seller-user/listing/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/@seller-user/listing/schema/ListingCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApiFx = Effect.fn("withCountApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;
	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/count",
			description: "Returns count of listings based on provided query",
			operationId: "apiListingCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
			summary: "Count listings based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiListingCount",
					userId: user.id,
				});

				const result = c.json<CountSchema.Type, 200>(
					yield* zodFx({
						schema: CountSchema,
						dataFx: listingCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<CountSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiListingCount");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
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
