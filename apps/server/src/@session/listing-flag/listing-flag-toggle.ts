import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingFlagToggleSchema } from "./schema/ListingFlagToggleSchema";
import { listingFlagToggleFx } from "./service/listingFlagToggleFx";

export const withListingFlagToggleApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-flag/toggle",
			description: "Toggle flag state on listing (add or remove)",
			operationId: "apiListingFlagToggle",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingFlagToggleSchema,
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
					description: "Invalid request",
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
				"listing-flag",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingFlagToggleFx({
					database: c.get("database"),
					userId: c.get("user").id,
					data: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess() {
						return Effect.succeed(c.body(null, 204));
					},
					onFailure(e) {
						return Effect.succeed(
							match(e)
								.with(
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
								)
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
