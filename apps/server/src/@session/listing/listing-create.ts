import { createRoute } from "@hono/zod-openapi";
import { embedMinHash, embedNumberRange } from "@use-pico/common/embedding";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withListingQueryBuilder } from "./db/withListingQueryBuilder";
import { withListingSelect } from "./db/withListingSelect";
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
				"listing",
				"session",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			await c
				.get("database")
				.insertInto("listing")
				.values({
					id,
					userId: user.id,
					price: data.price,
					priceVec: pgvector.toSql([
						data.price,
					]),
					condition: data.condition,
					conditionVec: pgvector.toSql(
						embedNumberRange({
							min: 0,
							max: 6,
							value: data.condition,
						}),
					),
					age: data.age,
					ageVec: pgvector.toSql(
						embedNumberRange({
							min: 0,
							max: 6,
							value: data.age,
						}),
					),
					locationId: data.locationId,
					categoryId: data.categoryId,
					createdAt: now,
					updatedAt: now,
					currency: data.currency,
					title: data.title,
					titleVec: pgvector.toSql(
						embedMinHash({
							value: data.title,
						}),
					),
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
				})
				.execute();

			await c
				.get("database")
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
						database: c.get("database"),
						sort: [],
						meta: undefined,
						userId: user.id,
					}),
					output: ListingSchema,
					where: {
						id,
						withOwn: true,
					},
					query(query) {
						return withListingQueryBuilder({
							userId: user.id,
							...query,
						});
					},
				}),
				201,
			);
		},
	);
};
