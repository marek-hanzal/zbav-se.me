import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { SeedRequestSchema, seedFx } from "~/@public/seed/fx/seedFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withSeedApiFx = Effect.fn("withSeedApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "post",
			path: "/seed",
			description: "Seed endpoint for user data",
			operationId: "apiSeed",
			request: {
				body: {
					content: {
						"application/json": {
							schema: SeedRequestSchema,
						},
					},
					description: "User data for seeding",
				},
			},
			responses: {
				201: {
					description: "Seed operation completed",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "User not found",
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
			security: [],
			tags: [
				"Misc",
			],
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				yield* Effect.annotateLogsScoped({
					endpoint: "apiSeed",
				});

				return c.json(
					yield* seedFx({
						...c.req.valid("json"),
					}),
					201,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiSeed")),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx({
					expires: 7,
					extend: 3,
				}),
				withLoggingFx(axiomConfig),
				withCatchFx({
					InvalidRequestError(err) {
						return c.json(noticeError(err), 400);
					},
					AccessDeniedError() {
						return c.json(NotFoundNotice, 404);
					},
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeError(err) {
						return c.json(noticeError(err), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
