import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { draftCollectionFx } from "~/@seller/draft/fx/draftCollectionFx";
import { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(DraftSchema);

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;

	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/collection",
			description: "Returns drafts based on provided parameters",
			operationId: "apiDraftCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftQuerySchema,
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
					description: "Access collection of drafts based on provided query",
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
				"Draft",
			],
			summary: "Fetch a collection of drafts based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: draftCollectionFx({
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
