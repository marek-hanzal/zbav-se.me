import { createRoute, z } from "@hono/zod-openapi";
import { genId } from "@use-pico/common";
import { AppEnv } from "../AppEnv";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { s3 } from "../s3"; // MinIO client init
import { ErrorSchema } from "../schema/ErrorSchema";

/**
 * ---- Schemas ----
 */

const AllowedContentTypes = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
	"image/heic",
	"image/heif",
] as const;

const AllowedExtensions = [
	"webp",
	"png",
	"jpg",
	"jpeg",
	"avif",
	"heic",
	"heif",
] as const;

export const S3PreSignRequestSchema = z
	.object({
		path: z.string().min(3).openapi({
			example:
				"/123e4567-e89b-12d3-a456-426614174000/listings/abc/gallery/photo.webp",
			description:
				"Object path. After stripping leading '/', must start with `<userId>/`",
		}),
		extension: z.enum(AllowedExtensions).openapi("AllowedExtensions", {
			example: "webp",
			description:
				"File extension. Must be one of the allowed extensions.",
		}),
		contentType: z
			.enum(AllowedContentTypes)
			.openapi("AllowedContentTypes", {
				example: "image/webp",
				description:
					"Browser-provided Content-Type used for PUT upload.",
			}),
	})
	.openapi("S3PreSignRequest");

export const S3PreSignResponseSchema = z
	.object({
		url: z.url().openapi({
			example:
				"https://s3.eu-central-003.backblazeb2.com/...?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
		}),
		path: z.string().openapi({
			example:
				"/123e4567-e89b-12d3-a456-426614174000/listing/abc/photo.webp",
			description: "Path on the bucket",
		}),
	})
	.openapi("S3PreSignResponse");

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
				201: {
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

			const key = `${user.id}/${path}/${genId()}.${extension}`;

			try {
				return c.json(
					{
						url: await s3.presignedPutObject(
							AppEnv.S3_BUCKET,
							key,
							60 * 30,
						),
						path: `/${key}`,
					} satisfies z.infer<typeof S3PreSignResponseSchema>,
					201,
				);
			} catch {
				return c.json(
					{
						error: "Failed to generate pre-signed URL",
					},
					500,
				);
			}
		},
	);

	session.route("/", sessionEndpoints);
};
