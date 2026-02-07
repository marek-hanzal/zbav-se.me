import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { uploadFetchFx } from "~/@user/upload/fx/uploadFetchFx";
import { UploadQuerySchema } from "~/@user/upload/schema/UploadQuerySchema";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
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
							schema: UploadSchema,
						},
					},
					description: "Return an upload item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Upload not found",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"Upload",
			],
			summary: "Fetch an upload item based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<UploadSchema.Type, 200>(
					yield* zodFx({
						schema: UploadSchema,
						dataFx: uploadFetchFx({
							...c.req.valid("json"),
							scope: {},
						}) satisfies Effect.Effect<UploadSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => c.json(noticeZodError(zod), 500),
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
});
