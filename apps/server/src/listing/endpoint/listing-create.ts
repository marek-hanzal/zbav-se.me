import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { ListingCreateSchema } from "../schema/ListingCreateSchema";
import { ListingDtoSchema } from "../schema/ListingDtoSchema";
import { withListingQueryBuilder } from "../withListingQueryBuilder";
import { withListingSelect } from "../withListingSelect";

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
							schema: ListingDtoSchema,
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
					vendor: data.vendor,
					model: data.model,
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
					output: ListingDtoSchema,
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
