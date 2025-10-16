import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { linkTo } from "@use-pico/common";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { z } from "zod";
import { AppEnv } from "../env";

// const ClientPayloadSchema = z.object({
// 	listingId: z.string().min(1).optional(),
// 	checksum: z.string(),
// });
// type ClientPayload = z.infer<typeof ClientPayloadSchema>;

const PutBlobResultSchema = z
	.looseObject({
		url: z.string().url(),
		downloadUrl: z.string().url(),
		pathname: z.string(),
		size: z.number().int().nonnegative(),
		uploadedAt: z.string(),
		contentType: z.string(),
		contentDisposition: z.string(),
	})
	.openapi("PutBlobResult");

const GenerateClientTokenEventSchema = z
	.object({
		type: z.literal("blob.generate-client-token"),
		payload: z.object({
			pathname: z.string(),
			multipart: z.boolean(),
			clientPayload: z.string().nullable(),
		}),
	})
	.openapi("GenerateClientTokenEvent");

const UploadCompletedEventSchema = z
	.object({
		type: z.literal("blob.upload-completed"),
		payload: z.object({
			blob: PutBlobResultSchema,
			tokenPayload: z.string().nullable().optional(),
		}),
	})
	.openapi("UploadCompletedEvent");

const HandleUploadBodySchema = z
	.union([
		GenerateClientTokenEventSchema,
		UploadCompletedEventSchema,
	])
	.openapi("HandleUploadBody");

const HandleUploadResponseSchema = z
	.union([
		z.object({
			type: z.literal("blob.generate-client-token"),
			clientToken: z.string(),
		}),
		z.object({
			type: z.literal("blob.upload-completed"),
			response: z.literal("ok"),
		}),
	])
	.openapi("HandleUploadResponse");

export const withContentApi = new OpenAPIHono();

withContentApi.openapi(
	createRoute({
		method: "post",
		path: "/content/upload",
		description:
			"Vercel Blob handleUpload proxy (v2). Accepts SDK events and issues short-lived client tokens.",
		operationId: "apiContentUpload",
		request: {
			body: {
				content: {
					"application/json": {
						schema: HandleUploadBodySchema,
					},
				},
				required: true,
				description: "Request body consumed by @vercel/blob/client",
			},
		},
		responses: {
			200: {
				description: "Response consumed by @vercel/blob/client",
				content: {
					"application/json": {
						schema: HandleUploadResponseSchema,
					},
				},
			},
		},
		tags: [
			"content",
		],
	}),
	async (c) => {
		return c.json(
			await handleUpload({
				request: c.req.raw,
				body: c.req.valid("json") satisfies HandleUploadBody,
				token: AppEnv.VERCEL_BLOB,

				async onBeforeGenerateToken(_pathname, _clientPayload) {
					return {
						allowedContentTypes: [
							"image/jpeg",
							"image/png",
							"image/webp",
							"image/avif",
						],
						addRandomSuffix: true,
						allowOverwrite: false,
						cacheControlMaxAge: 60 * 60 * 24 * 30,
						maximumSizeInBytes: 16 * 1024 * 1024,
						callbackUrl: linkTo({
							base: AppEnv.VITE_API,
							href: "/api/content/upload",
						}),
						// tokenPayload: JSON.stringify(payload),
						tokenPayload: null,
					};
				},

				async onUploadCompleted({ blob, tokenPayload: _ }) {
					// const payload = ClientPayloadSchema.parse(
					// 	JSON.parse(tokenPayload ?? "{}"),
					// );

					// await db.photo.insert({ listingId: p.listingId, path: blob.pathname, size: blob.size, type: blob.contentType })

					console.log("Blob uploaded:", {
						blob,
						// payload,
					});
				},
			}),
		);
	},
);
