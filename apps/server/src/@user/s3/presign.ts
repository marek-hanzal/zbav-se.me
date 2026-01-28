import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { S3ContextLayer } from "~/@session/s3/context/S3ContextLayer";
import { s3PreSignFx } from "~/@session/s3/fx/s3PreSignFx";
import { UploadContextLayer } from "~/@user/upload/context/UploadContextLayer";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";
import { ServerS3Schema } from "~/schema/env/ServerS3Schema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { S3PreSignRequestSchema } from "./schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "./schema/S3PreSignResponseSchema";

export const withPresignApiFx = Effect.fn("withPresignApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/s3/pre-sign",
			description:
				"Generate a pre-signed URL for direct S3-compatible PUT upload (private bucket). Expiration is server-controlled. A random suffix is always added.",
			operationId: "apiS3Presign",
			request: {
				body: {
					content: {
						"application/json": {
							schema: S3PreSignRequestSchema,
						},
					},
					required: true,
				},
			},
			responses: {
				200: {
					description: "Pre-signed URL generated successfully.",
					content: {
						"application/json": {
							schema: S3PreSignResponseSchema,
						},
					},
				},
				500: {
					description: "Failed to generate pre-signed URL.",
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
				},
			},
			tags: [
				"S3",
			],
			summary: "Generate a pre-signed URL for direct S3-compatible PUT upload",
		}),
		async (c) => {
			const s3Config = ServerS3Schema.parse(process.env);
			const cdnConfig = ServerCdnSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");
				const { path, extension } = c.req.valid("json");

				return c.json<S3PreSignResponseSchema.Type, 200>(
					yield* zodFx({
						schema: S3PreSignResponseSchema,
						dataFx: s3PreSignFx({
							userId: user.id,
							path,
							extension,
						}) satisfies Effect.Effect<S3PreSignResponseSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(
					S3ContextLayer({
						api: s3Config.SERVER_S3_API,
						key: s3Config.SERVER_S3_KEY,
						secret: s3Config.SERVER_S3_SECRET,
						bucket: s3Config.SERVER_S3_BUCKET,
					}),
				),
				Effect.provide(
					UploadContextLayer({
						cdn: cdnConfig.SERVER_CONTENT_CDN,
					}),
				),
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
