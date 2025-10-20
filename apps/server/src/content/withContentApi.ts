import { createRoute } from "@hono/zod-openapi";
import { linkTo } from "@use-pico/common";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { AppEnv } from "../env";
import { withSessionHono } from "../withSessionHono";
import { ClientPayloadSchema } from "./schema/ClientPayloadSchema";
import { HandleUploadBodySchema } from "./schema/HandleUploadBodySchema";
import { HandleUploadResponseSchema } from "./schema/HandleUploadResponseSchema";

export const withContentApi = withSessionHono();

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
				async onBeforeGenerateToken(pathname, clientPayload) {
					const user = c.get("user");
					if (!pathname.startsWith(`/${user.id}/`)) {
						throw new Error(
							"Unauthorized: Path must start with user ID",
						);
					}

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
						tokenPayload: JSON.stringify(
							ClientPayloadSchema.parse(clientPayload),
						),
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
