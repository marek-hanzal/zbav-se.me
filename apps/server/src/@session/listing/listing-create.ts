import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { withListingQueryBuilder } from "./db/withListingQueryBuilder";
import { withListingSelect } from "./db/withListingSelect";
import { embedListing } from "./embedListing";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingSchema } from "./schema/ListingSchema";

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
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			await database.kysely
				.insertInto("listing")
				.values({
					id,
					userId: user.id,
					price: data.price,
					condition: data.condition,
					age: data.age,
					locationId: data.locationId,
					categoryId: data.categoryId,
					createdAt: now,
					updatedAt: now,
					currency: data.currency,
					title: data.title,
					description: data.description,
					expiresAt: match(data.expiresAt)
						.with("7-days", () =>
							DateTime.now()
								.plus({
									days: 7,
								})
								.toJSDate(),
						)
						.with("14-days", () =>
							DateTime.now()
								.plus({
									days: 14,
								})
								.toJSDate(),
						)
						.with("1-month", () =>
							DateTime.now()
								.plus({
									months: 1,
								})
								.toJSDate(),
						)
						.exhaustive(),
					embedding: pgvector.toSql([
						...(await embedListing(data)),
					]),
				})
				.execute();

			await database.kysely
				.insertInto("gallery")
				.values(
					data.uploadIds.map((uploadId, index) => ({
						id: genId(),
						userId: user.id,
						createdAt: now,
						listingId: id,
						uploadId,
						sort: index,
					})),
				)
				.execute();

			return c.json(
				await withFetch({
					select: withListingSelect({
						sort: [],
						meta: undefined,
					}),
					output: ListingSchema,
					where: {
						id,
					},
					query: withListingQueryBuilder,
				}),
				201,
			);
		},
	);
};
