import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { ListingSchema } from "~/@buyer-user/listing/schema/ListingSchema";
import { thumbCreateFx } from "~/@buyer-user/thumb/fx/thumbCreateFx";
import { ThumbCreateSchema } from "~/@buyer-user/thumb/schema/ThumbCreateSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/thumb/create",
			description: "Create a new thumb",
			operationId: "apiThumbCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ThumbCreateSchema,
						},
					},
					description: "Data for creating a new thumb",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "The thumb was created and the updated listing is returned",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request - duplicate thumb or invalid data",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
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
				"Thumb",
			],
			summary: "Create a new thumb for a listing",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiThumbCreate",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: ListingSchema,
						dataFx: thumbCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiThumbCreate")),
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				withDateFx,
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
