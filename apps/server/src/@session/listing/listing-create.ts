import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingSchema } from "./schema/ListingSchema";
import { listingCreateFx } from "./service/listingCreateFx";

export const withListingCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/create",
			description: "Create a new listing",
			operationId: "apiListingCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCreateSchema,
						},
					},
					description: "Data for creating a new listing",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "The created listing",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing not found after creation",
				},
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingCreateFx({
					database: c.get("database"),
					userId: c.get("user").id,
					data: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(listing) {
						return Effect.succeed(c.json<ListingSchema.Type, 201>(listing, 201));
					},
					onFailure(e) {
						return Effect.succeed(
							match(e)
								.with(
									{
										_tag: "NotFoundError",
									},
									() => {
										return c.json<MessageSchema.Type, 404>(
											{
												type: "error",
												message: e.message,
											},
											404,
										);
									},
								)
								.exhaustive(),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
