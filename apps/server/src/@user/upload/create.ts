import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { UploadContextLayer } from "~/@common/upload/context/UploadContextLayer";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { UploadCreateSchema } from "~/@user/upload/schema/UploadCreateSchema";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
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
							schema: NoticeSchema,
						},
					},
					description: "Invalid URL",
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
			summary: "Create a new upload",
		}),
		async (c) => {
			const cdnConfig = ServerCdnSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<UploadSchema.Type, 201>(
					yield* zodFx({
						schema: UploadSchema,
						dataFx: uploadCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<UploadSchema.Type, any, any>,
					}),
					201,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withDateFx,
				Effect.provide(
					UploadContextLayer({
						cdn: cdnConfig.SERVER_CONTENT_CDN,
					}),
				),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => c.json(noticeError(e), 400),
							),
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
