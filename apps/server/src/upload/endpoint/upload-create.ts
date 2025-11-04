import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { AppEnv } from "../../AppEnv";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { UploadCreateSchema } from "../schema/UploadCreateSchema";
import { UploadDtoSchema } from "../schema/UploadDtoSchema";
import { withUploadQueryBuilder } from "../withUploadQueryBuilder";
import { withUploadSelect } from "../withUploadSelect";

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
							schema: UploadDtoSchema,
						},
					},
					description: "The created upload",
				},
				400: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Invalid URL",
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
				return c.json(
					{
						message: "Only content from the CDN can be uploaded",
					} satisfies ErrorDtoSchema.Type,
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

			return c.json(
				await withFetch({
					select: withUploadSelect(),
					output: UploadDtoSchema,
					where: {
						id,
					},
					query: withUploadQueryBuilder,
				}),
				201,
			);
		},
	);
};
