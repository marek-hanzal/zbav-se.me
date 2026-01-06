import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { s3PreSignFx } from "~/app/s3/fx/s3PreSignFx";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { S3PreSignRequestSchema } from "./schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "./schema/S3PreSignResponseSchema";

export const withPresignApi: Routes.Fn = async ({ userHono }) => {
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
				"s3",
				"user",
			],
		}),
		async (c) => {
			const { path, extension } = c.req.valid("json");

			return Effect.gen(function* () {
				const user = yield* UserContextFx;

				return c.json<S3PreSignResponseSchema.Type, 200>(
					yield* zodFx({
						schema: S3PreSignResponseSchema,
						dataFx: s3PreSignFx({
							userId: user.id,
							path,
							extension,
						}),
					}),
					200,
				);
			}).pipe(
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
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
};
