import { createRoute, z } from "@hono/zod-openapi";
import { AppEnv } from "../AppEnv";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withHono } from "../hono/withHono";
import { s3 } from "../s3";
import { ErrorSchema } from "../schema/ErrorSchema";

const CleanupResponseSchema = z
	.object({
		scanned: z.number(),
		deleted: z.number(),
		removed: z.array(z.string()),
	})
	.openapi("CleanupResponse");

type CleanupResponseSchema = typeof CleanupResponseSchema;

namespace CleanupResponseSchema {
	export type Type = z.infer<CleanupResponseSchema>;
}

export const withJanitorApi: Routes.Fn = ({ public: publicEndpoints }) => {
	const endpoints = withHono();

	endpoints.openapi(
		createRoute({
			method: "post",
			path: "/janitor/cleanup",
			description: "Smaže z MinIO vše, co není v tabulce `upload`.",
			operationId: "apiJanitorCleanup",
			request: {
				body: {
					content: {
						"application/json": {
							schema: z.object({}),
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CleanupResponseSchema,
						},
					},
					description: "When cleanup is done",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Error during cleanup",
				},
			},
			tags: [
				"janitor",
			],
		}),
		async (c) => {
			try {
				const limit = 200;
				const maxScan = 5000;

				const uploads = await database.kysely
					.selectFrom("upload")
					.select([
						"url",
					])
					.execute();
				const urls = new Set(
					uploads.map((r) => new URL(r.url).pathname),
				);

				let scanned = 0;
				const kill: string[] = [];

				await new Promise<void>((resolve, reject) => {
					const stream = s3.listObjectsV2(
						AppEnv.SERVER_S3_BUCKET,
						"",
						true,
					);

					stream.on("data", (obj) => {
						if (scanned >= maxScan) {
							stream.removeAllListeners();
							return resolve();
						}

						scanned++;

						if (!obj.name || obj.name.endsWith("/")) {
							return;
						}
						if (!urls.has(`/${obj.name}`) && kill.length < limit) {
							kill.push(obj.name);
						}
					});

					stream.on("end", resolve);
					stream.on("error", reject);
				});

				await s3.removeObjects(AppEnv.SERVER_S3_BUCKET, kill);

				return c.json(
					{
						scanned,
						deleted: kill.length,
						removed: kill,
					} satisfies CleanupResponseSchema.Type,
					200,
				);
			} catch (e) {
				console.error(e);
				return c.json(
					{
						message: "Cleanup failed",
					} satisfies ErrorSchema.Type,
					500,
				);
			}
		},
	);

	publicEndpoints.route("/", endpoints);
};
