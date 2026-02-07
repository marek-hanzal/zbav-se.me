import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { S3ContextLayer } from "~/@common/s3/context/S3ContextLayer";
import { cleanupFx } from "~/@public/janitor/cleanup/cleanupFx";
import { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { ServerS3Schema } from "~/schema/env/ServerS3Schema";
import { NoticeSchema } from "~/schema/NoticeSchema";

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
				"Janitor",
			],
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			try {
				const s3Config = ServerS3Schema.parse(process.env);

				return await Effect.gen(function* () {
					yield* Effect.annotateLogsScoped({
						endpoint: "apiJanitorCleanup",
					});

					const result = c.json(
						yield* zodFx({
							schema: z.array(CleanupSchema),
							dataFx: cleanupFx() satisfies Effect.Effect<
								CleanupSchema.Type[],
								any,
								any
							>,
						}),
						200,
					);

					yield* Effect.log("apiJanitorCleanup");

					return result;
				}).pipe(
					withKyselyFx(c.get("kysely")),
					withDateFx,
					Effect.provide(
						S3ContextLayer({
							api: s3Config.SERVER_S3_API,
							key: s3Config.SERVER_S3_KEY,
							secret: s3Config.SERVER_S3_SECRET,
							bucket: s3Config.SERVER_S3_BUCKET,
						}),
					),
					withLoggingFx(axiomConfig),
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
