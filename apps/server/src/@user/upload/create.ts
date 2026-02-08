import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { UploadCreateSchema } from "~/@user/upload/schema/UploadCreateSchema";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
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
			const axiomConfig = ServerAxiomSchema.parse(process.env);
			const cdnConfig = ServerCdnSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiUploadCreate",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: UploadSchema,
						dataFx: uploadCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiUploadCreate")),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withUploadFx({
					cdn: cdnConfig.SERVER_CONTENT_CDN,
				}),
				withLoggingFx(axiomConfig),
				withCatchFx({
					InvalidRequestError(e) {
						return c.json(noticeError(e), 400);
					},
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
