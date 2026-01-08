import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { cleanupFx } from "~/@public/janitor/cleanup/cleanupFx";
import { AppEnv } from "~/AppEnv";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { S3ContextLayer } from "~/app/s3/context/S3ContextLayer";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { CleanupSchema } from "./schema/CleanupSchema";

export const withJanitorCleanupApiFx = Effect.fn("withJanitorCleanupApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/janitor/cleanup",
			description: "General cleanup operation",
			operationId: "apiJanitorCleanup",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(CleanupSchema),
						},
					},
					description: "When cleanup is done",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Error during cleanup",
				},
			},
			security: [],
			tags: [
				"janitor",
			],
		}),
		async (c) => {
			try {
				return await Effect.gen(function* () {
					return c.json(
						yield* zodFx({
							schema: z.array(CleanupSchema),
							dataFx: cleanupFx(),
						}),
						200,
					);
				}).pipe(
					Effect.provide(KyselyContextLayer(c.get("kysely"))),
					Effect.provide(
						S3ContextLayer({
							api: AppEnv.SERVER_S3_API,
							key: AppEnv.SERVER_S3_KEY,
							secret: AppEnv.SERVER_S3_SECRET,
							bucket: AppEnv.SERVER_S3_BUCKET,
						}),
					),
					Effect.runPromise,
				);
			} catch (e) {
				console.error(e);
				return c.json<NoticeSchema.Type, 500>(
					{
						type: "error",
						message: "Cleanup failed",
					},
					500,
				);
			}
		},
	);
});
