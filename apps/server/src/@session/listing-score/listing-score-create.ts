import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingScoreCreateSchema } from "./schema/ListingScoreCreateSchema";

export const withListingScoreCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/create",
			description: "Create a new listing score",
			operationId: "apiListingScoreCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreCreateSchema,
						},
					},
					description: "Data for creating a new listing score",
				},
			},
			responses: {
				201: {
					description: "The listing score was created",
				},
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Cannot score your own listing",
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
				"listing-score",
				"session",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			// Check if listing exists and get its userId
			const listing = await database.kysely
				.selectFrom("listing")
				.select("userId")
				.where("id", "=", data.listingId)
				.executeTakeFirst();

			if (!listing) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Listing not found",
					},
					404,
				);
			}

			// Check if user is trying to score their own listing
			if (listing.userId === user.id) {
				return c.json<MessageSchema.Type, 400>(
					{
						type: "error",
						message: "Cannot score your own listing",
					},
					400,
				);
			}

			await database.kysely
				.insertInto("listing_score")
				.values({
					id,
					listingId: data.listingId,
					userId: user.id,
					score: data.score,
					createdAt: now,
				})
				.execute();

			return c.body(null, 201);
		},
	);
};
