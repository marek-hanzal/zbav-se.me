import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { flagToggleFx } from "~/@buyer-user/flag/fx/flagToggleFx";
import { FlagToggleSchema } from "~/@buyer-user/flag/schema/FlagToggleSchema";
import { ListingSchema } from "~/@buyer-user/listing/schema/ListingSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withToggleApiFx = Effect.fn("withToggleApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/flag/toggle",
			description: "Toggle flag state on listing (add or remove)",
			operationId: "apiFlagToggle",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FlagToggleSchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "Nothing to say, we're just happy",
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
				"Flag",
			],
			summary: "Toggle flag state on listing (add or remove)",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFlagToggle",
					userId: user.id,
				});

				const result = c.json<ListingSchema.Type, 200>(
					yield* zodFx({
						schema: ListingSchema,
						dataFx: flagToggleFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<ListingSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiFlagToggle");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				//
				withDateFx,
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
