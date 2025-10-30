import { createRoute } from "@hono/zod-openapi";
import { genId, keyOf, linkTo } from "@use-pico/common";
import { AppEnv } from "../AppEnv";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { s3 } from "../s3";
import { ErrorSchema } from "../schema/ErrorSchema";
import { S3PreSignRequestSchema } from "./schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "./schema/S3PreSignResponseSchema";

export const withS3Api: Routes.Fn = ({ session }) => {
	const sessionEndpoints = withSessionHono();

	sessionEndpoints.openapi(
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
				403: {
					description: "Unauthorized (path prefix must match user).",
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
				},
				500: {
					description: "Failed to generate pre-signed URL.",
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
				},
			},
			tags: [
				"s3",
			],
		}),
		async (c) => {
			const { path, extension } = c.req.valid("json");

			const user = c.get("user");

			const key = `${keyOf(user.id)}/${path}/${genId()}.${extension}`;

			try {
				return c.json(
					{
						url: await s3.presignedPutObject(
							AppEnv.SERVER_S3_BUCKET,
							key,
							60 * 30,
						),
						cdn: linkTo({
							base: AppEnv.SERVER_CONTENT_CDN,
							href: `/${key}`,
						}),
					} satisfies S3PreSignResponseSchema.Type,
					200,
				);
			} catch {
				return c.json(
					{
						message: "Failed to generate pre-signed URL",
					} satisfies ErrorSchema.Type,
					500,
				);
			}
		},
	);

	session.route("/", sessionEndpoints);
};
