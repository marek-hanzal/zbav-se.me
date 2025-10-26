import { createRoute, z } from "@hono/zod-openapi";
import { genId, withCount, withFetch, withList } from "@use-pico/common";
import { AppEnv } from "../AppEnv";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { CountSchema } from "../schema/CountSchema";
import { ErrorSchema } from "../schema/ErrorSchema";
import { UploadCreateSchema } from "./schema/UploadCreateSchema";
import { UploadDtoSchema } from "./schema/UploadDtoSchema";
import { UploadQuerySchema } from "./schema/UploadQuerySchema";
import {
	withUploadQueryBuilder,
	withUploadQueryBuilderWithSort,
} from "./withUploadQueryBuilder";
import { withUploadSelect } from "./withUploadSelect";

export const withUploadApi: Routes.Fn = ({ session }) => {
	const hono = withSessionHono();

	hono.openapi(
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
							schema: ErrorSchema,
						},
					},
					description: "Invalid URL",
				},
			},
			tags: [
				"upload",
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
					} satisfies ErrorSchema.Type,
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
					query({ select, where }) {
						return withUploadQueryBuilderWithSort({
							select,
							where,
						});
					},
				}),
				201,
			);
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/upload/fetch",
			description: "Return an upload item based on the provided query",
			operationId: "apiUploadFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
					description: "Query object for upload fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UploadDtoSchema,
						},
					},
					description:
						"Return an upload item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Upload not found",
				},
			},
			tags: [
				"upload",
			],
		}),
		async (c) => {
			const { filter, where, sort } = c.req.valid("json");

			const result = await withFetch({
				select: withUploadSelect(),
				output: UploadDtoSchema,
				filter,
				where,
				query({ select, where }) {
					return withUploadQueryBuilderWithSort({
						select,
						where,
						sort,
					});
				},
			});

			if (!result) {
				return c.json(
					{
						message: "Upload not found",
					} satisfies ErrorSchema.Type,
					404,
				);
			}

			return c.json(result, 200);
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/upload/collection",
			description: "Returns upload items based on provided parameters",
			operationId: "apiUploadCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(UploadDtoSchema),
						},
					},
					description:
						"Access collection of upload items based on provided query",
				},
			},
			tags: [
				"upload",
			],
		}),
		async (c) => {
			const { cursor, filter, where, sort } = c.req.valid("json");
			return c.json(
				await withList({
					select: withUploadSelect(),
					output: UploadDtoSchema,
					cursor,
					filter,
					where,
					query({ select, where }) {
						return withUploadQueryBuilderWithSort({
							select,
							where,
							sort,
						});
					},
				}),
			);
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/upload/count",
			description:
				"Returns count of upload items based on provided query",
			operationId: "apiUploadCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
				},
			},
			tags: [
				"upload",
			],
		}),
		async (c) => {
			const { filter, where } = c.req.valid("json");
			return c.json(
				await withCount({
					select: withUploadSelect(),
					filter,
					where,
					query({ select, where }) {
						return withUploadQueryBuilder({
							select,
							where,
						});
					},
				}),
			);
		},
	);

	session.route("/", hono);
};
