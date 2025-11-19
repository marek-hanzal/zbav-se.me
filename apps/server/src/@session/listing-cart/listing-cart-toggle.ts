import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { DefaultListingScore } from "../listing-score/config/DefaultListingScore";
import { ListingScoreContextProvider } from "../listing-score/fx/ListingScoreContextFx";
import { listingCartToggleFx } from "./fx/listingCartToggleFx";
import { ListingCartToggleSchema } from "./schema/ListingCartToggleSchema";

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
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing not found",
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
				"listing-cart",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* listingCartToggleFx({
					data: c.req.valid("json"),
				});

				return c.body(null, 204);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				ListingScoreContextProvider(DefaultListingScore),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
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
							),
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => {
									return c.json<MessageSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
