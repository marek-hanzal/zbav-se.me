import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
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
				201: {
					description: "The cart item was added",
				},
				204: {
					description: "The cart item was removed",
				},
			},
			tags: [
				"listing-cart",
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
					.insertInto("listing_cart")
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

				return c.body(null, 201);
			}

			// Remove from cart
			await database.kysely
				.deleteFrom("listing_cart")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();

			return c.body(null, 204);
		},
	);
};
