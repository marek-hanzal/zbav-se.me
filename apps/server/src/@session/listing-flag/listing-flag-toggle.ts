import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { createListingScoreFx } from "../listing-score/service/createListingScoreFx";
import { ListingFlagToggleSchema } from "./schema/ListingFlagToggleSchema";

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
			},
			tags: [
				"listing-flag",
				"session",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const { toggle, listingId } = data;

			if (toggle) {
				const id = genId();
				const now = new Date();

				await database.kysely
					.insertInto("listing_flag")
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
					createListingScoreFx({
						database: database.kysely,
						userId: user.id,
						listingId,
						score: "flag",
					}).pipe(
						Effect.catchTag("TooManyRequests", () => {
							return Effect.succeed(undefined);
						}),
					),
				);

				return c.body(null, 204);
			}

			await database.kysely
				.deleteFrom("listing_flag")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();

			return c.body(null, 204);
		},
	);
};
