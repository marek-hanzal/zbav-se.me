import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingCartToggleSchema } from "./schema/ListingCartToggleSchema";
import { listingCartToggleFx } from "./service/listingCartToggleFx";

export const withListingCartToggleApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-cart/toggle",
			description: "Toggle listing in cart (add or remove)",
			operationId: "apiListingCartToggle",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCartToggleSchema,
						},
					},
				},
			},
			responses: {
				204: {
					description: "Nothing to say, we're just happy",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "You cannot add your own listing to cart",
				},
				429: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Too many requests",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing not found",
				},
			},
			tags: [
				"listing-cart",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingCartToggleFx({
					database: database.kysely,
					userId: c.get("user").id,
					data: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess() {
						return Effect.succeed(c.body(null, 204));
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
						return match(e)
							.with(
								{
									_tag: "InvalidRequestError",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type, 400>({
											type: "error",
											message: e.message,
										}),
									);
								},
							)
							.with(
								{
									_tag: "TooManyRequests",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type>(
											{
												type: "error",
												message: e.message,
											},
											429,
										),
									);
								},
							)
							.with(
								{
									_tag: "NotFoundError",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type, 404>({
											type: "error",
											message: e.message,
										}),
									);
								},
							)
							.exhaustive();
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
