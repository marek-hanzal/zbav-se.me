import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextProvider } from "../../fx/DatabaseContextFx";
import { UserContextProvider } from "../../fx/UserContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingScoreCreateFx } from "../listing-score/fx/listingScoreCreateFx";
import { ListingIgnoreToggleSchema } from "./schema/ListingIgnoreToggleSchema";

export const withListingIgnoreToggleApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-ignore/toggle",
			description: "Toggle listing ignore state (add or remove)",
			operationId: "apiListingIgnoreToggle",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingIgnoreToggleSchema,
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
			},
			tags: [
				"listing-ignore",
				"session",
			],
		Match.exhaustive,
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const { toggle, listingId } = data;

			if (toggle) {
				const id = genId();
				const now = new Date();

				const listing = await c
					.get("database")
					.selectFrom("listing")
					.selectAll()
					.where("id", "=", listingId)
					.where("userId", "=", user.id)
					.executeTakeFirst();

				if (listing) {
					return c.json<MessageSchema.Type, 400>(
						{
							type: "error",
							message: "You cannot ignore your own listing",
						},
						400,
					);
				}

				await c
					.get("database")
					.insertInto("listing_ignore")
					.values({
						id,
						userId: user.id,
						listingId,
						createdAt: now,
					})
					.onConflict((oc) =>
						oc
							.columns([
								"userId",
								"listingId",
							])
							.doNothing(),
					)
					.execute();

				await Effect.runPromise(
					listingScoreCreateFx({
						listingId,
						score: "ignore",
					}).pipe(
						DatabaseContextProvider(c.get("database")),
						UserContextProvider(user),
						//
						Effect.catchTags({
							TooManyRequests: () => {
								return Effect.succeed(undefined);
							},
							InvalidRequestError: () => {
								return Effect.succeed(undefined);
							},
						Match.exhaustive,
					),
				);

				return c.body(null, 204);
			}

			await c
				.get("database")
				.deleteFrom("listing_ignore")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();

			return c.body(null, 204);
		},
	);
};
