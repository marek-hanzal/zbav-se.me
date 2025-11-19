import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { S3PreSignRequestSchema } from "./schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "./schema/S3PreSignResponseSchema";
import { s3PreSignFx } from "./service/s3PreSignFx";

export const withS3PresignApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
							schema: MessageSchema,
						},
					},
				},
			},
			tags: [
				"s3",
				"session",
			],
		}),
		async (c) => {
			const { path, extension } = c.req.valid("json");

			return Effect.gen(function* () {
				return c.json<S3PreSignResponseSchema.Type, 200>(
					yield* s3PreSignFx({
						userId: c.get("user").id,
						path,
						extension,
					}),
					200,
				);
			}).pipe(
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "Failed to generate pre-signed URL",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
