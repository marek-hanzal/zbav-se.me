import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@buyer/listing-event/fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "~/@buyer/listing-event/schema/ListingEventCreateSchema";
import { ListingEventSchema } from "~/@buyer/listing-event/schema/ListingEventSchema";
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
	const { buyerHono } = yield* RoutesContextFx;
	buyerHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-event/create",
			description: "Create a new listing event",
			operationId: "apiListingEventCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingEventCreateSchema,
						},
					},
					description: "Data for creating a new listing event",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingEventSchema,
						},
					},
					description: "The listing event was created",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Cannot create event on your own listing",
				},
				429: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Too many requests - please wait between events",
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
				"Listing Event",
			],
			summary: "Create a new listing event",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiListingEventCreate",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: ListingEventSchema,
						dataFx: listingEventCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiListingEventCreate"),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withCatchFx({
					InvalidRequestErrorFx(e) {
						return c.json(noticeError(e), 400);
					},
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					TooManyRequestsFx(e) {
						return c.json(noticeError(e), 429);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
