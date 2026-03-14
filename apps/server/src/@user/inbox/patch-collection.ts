import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { inboxPatchCollectionFx } from "~/@user/inbox/fx/inboxPatchCollectionFx";
import { InboxPatchCollectionSchema } from "~/@user/inbox/schema/InboxPatchCollectionSchema";
import { InboxSchema } from "~/@user/inbox/schema/InboxSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(InboxSchema);

export const withPatchCollectionApiFx = Effect.fn("withPatchCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/inbox/patch-collection",
			description: "Patch inbox items resolved by query",
			operationId: "apiInboxPatchCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: InboxPatchCollectionSchema,
						},
					},
					description: "Inbox collection patch payload",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Patched inbox items",
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
			summary: "Patch inbox collection",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: inboxPatchCollectionFx({
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
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
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
