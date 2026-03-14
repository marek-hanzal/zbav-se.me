import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { inboxCollectionFx } from "~/@user/inbox/fx/inboxCollectionFx";
import { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";
import { InboxSchema } from "~/@user/inbox/schema/InboxSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(InboxSchema);

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/inbox/collection",
			description: "Returns inbox entries based on provided query",
			operationId: "apiInboxCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: InboxQuerySchema,
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
					description: "Inbox collection",
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
				"Inbox",
			],
			summary: "Fetch inbox collection",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: inboxCollectionFx({
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
