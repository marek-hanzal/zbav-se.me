import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { linkTo } from "@use-pico/common/link-to";
import { AppEnv } from "../../AppEnv";
import type { Routes } from "../../hono/Routes";
import { s3 } from "../../s3";
import { MessageSchema } from "../../schema/MessageSchema";
import { S3PreSignRequestSchema } from "./schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "./schema/S3PreSignResponseSchema";

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

			const user = c.get("user");

			const key = `${keyOf(user.id)}/${path}/${genId()}.${extension}`;

			try {
				return c.json<S3PreSignResponseSchema.Type, 200>(
					{
						url: await s3.presignedPutObject(AppEnv.SERVER_S3_BUCKET, key, 60 * 30),
						cdn: linkTo({
							base: AppEnv.SERVER_CONTENT_CDN,
							href: `/${key}`,
						}),
					},
					200,
				);
			} catch {
				return c.json<MessageSchema.Type, 500>(
					{
						type: "error",
						message: "Failed to generate pre-signed URL",
					},
					500,
				);
			}
		},
	);
};
