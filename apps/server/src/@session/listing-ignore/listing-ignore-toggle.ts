import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { createListingScoreFx } from "../listing-score/service/createListingScoreFx";
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
			},
			tags: [
				"listing-ignore",
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
					createListingScoreFx({
						database: database.kysely,
						userId: user.id,
						listingId,
						score: "ignore",
					}).pipe(
						Effect.catchTag("TooManyRequests", () => {
							return Effect.succeed(undefined);
						}),
					),
				);

				return c.body(null, 204);
			}

			await database.kysely
				.deleteFrom("listing_ignore")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();

			return c.body(null, 204);
		},
	);
};
