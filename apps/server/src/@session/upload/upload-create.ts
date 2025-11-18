import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { AppEnv } from "../../AppEnv";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withUploadQueryBuilder } from "./db/withUploadQueryBuilder";
import { withUploadSelect } from "./db/withUploadSelect";
import { UploadCreateSchema } from "./schema/UploadCreateSchema";
import { UploadSchema } from "./schema/UploadSchema";

export const withUploadCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/create",
			description: "Create a new upload",
			operationId: "apiUploadCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadCreateSchema,
						},
					},
					description: "Data for creating a new upload",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: UploadSchema,
						},
					},
					description: "The created upload",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Invalid URL",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Upload not found",
				},
			},
			tags: [
				"upload",
				"session",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			if (!data.url.startsWith(AppEnv.SERVER_CONTENT_CDN)) {
				return c.json<MessageSchema.Type, 400>(
					{
						type: "error",
						message: "Only content from the CDN can be uploaded",
					},
					400,
				);
			}

			await database.kysely
				.insertInto("upload")
				.values({
					id,
					userId: user.id,
					url: data.url,
					createdAt: now,
				})
				.execute();

			const upload = await withFetch({
				select: withUploadSelect({
					database: database.kysely,
				}),
				output: UploadSchema,
				where: {
					id,
				},
				query: withUploadQueryBuilder,
			});

			if (!upload) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Upload not found",
					},
					404,
				);
			}

			return c.json<UploadSchema.Type, 201>(upload, 201);
		},
	);
};
