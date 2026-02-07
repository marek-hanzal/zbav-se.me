import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "~/@buyer-session/listing-event/schema/ListingEventCreateSchema";
import { ListingEventSchema } from "~/@buyer-session/listing-event/schema/ListingEventSchema";
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
	const { buyerSessionHono } = yield* RoutesContextFx;
	buyerSessionHono.openapi(
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

				const result = c.json<ListingEventSchema.Type, 201>(
					yield* zodFx({
						schema: ListingEventSchema,
						dataFx: listingEventCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<ListingEventSchema.Type, any, any>,
					}),
					201,
				);

				yield* Effect.log("apiListingEventCreate");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withCatchFx({
					InvalidRequestError(e) {
						return c.json(noticeError(e), 400);
					},
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					TooManyRequests(e) {
						return c.json(noticeError(e), 429);
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
