import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingFlagCountQuerySchema } from "./schema/ListingFlagCountQuerySchema";
import { listingFlagCountFx } from "./service/listingFlagCountFx";

export const withListingFlagCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-flag/count",
			description: "Returns count of listing flag items based on provided query",
			operationId: "apiListingFlagCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingFlagCountQuerySchema,
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
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"listing-flag",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingFlagCountFx({
					database: c.get("database"),
					userId: c.get("user").id,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(count) {
						return Effect.succeed(c.json<CountSchema.Type, 200>(count, 200));
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
						match(e).exhaustive();

						return Effect.succeed(
							c.json<MessageSchema.Type, 500>(
								{
									type: "error",
									message: "This should not happen",
								},
								500,
							),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
