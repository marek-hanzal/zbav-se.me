import { createRoute } from "@hono/zod-openapi";
import { genId, withCollection, withCount, withFetch } from "@use-pico/common";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
import { CountSchema } from "../schema/CountSchema";
import { ErrorSchema } from "../schema/ErrorSchema";
import { withCollectionSchema } from "../schema/withCollectionSchema";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingDtoSchema } from "./schema/ListingDtoSchema";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import {
	withListingQueryBuilder,
	withListingQueryBuilderWithSort,
} from "./withListingQueryBuilder";
import { withListingSelect } from "./withListingSelect";

export const withListingApi: Routes.Fn = ({ session }) => {
	const sessionEndpoints = withSessionHono();

	sessionEndpoints.openapi(
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
						requireGallery: false,
					}),
					output: ListingDtoSchema,
					where: {
						id,
					},
					query({ select, where }) {
						return withListingQueryBuilderWithSort({
							select,
							where,
						});
					},
				}),
				201,
			);
		},
	);

	sessionEndpoints.openapi(
		createRoute({
			method: "post",
			path: "/listing/fetch",
			description: "Return a listing based on the provided query",
			operationId: "apiListingFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
						},
					},
					description: "Query object for listing fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingDtoSchema,
						},
					},
					description: "Return a listing based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Listing not found",
				},
			},
			tags: [
				"listing",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "listing:fetch",
					version: "1",
					value: json,
				},
				fetch: () =>
					withFetch({
						select: withListingSelect(),
						output: ListingDtoSchema,
						filter,
						where,
						query({ select, where }) {
							return withListingQueryBuilderWithSort({
								select,
								where,
								sort,
							});
						},
					}),
			});

			if (!data) {
				return c.json(
					{
						message: "Listing not found",
					},
					404,
				);
			}
			return c.json(data satisfies ListingDtoSchema.Type, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	sessionEndpoints.openapi(
		createRoute({
			method: "post",
			path: "/listing/collection",
			description: "Returns listings based on provided parameters",
			operationId: "apiListingCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingDtoSchema,
								type: "ListingCollection",
								description: "Collection of listings",
							}),
						},
					},
					description:
						"Access collection of listings based on provided query",
				},
			},
			tags: [
				"listing",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "listing:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCollection({
						select: withListingSelect(),
						output: ListingDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query({ select, where }) {
							return withListingQueryBuilderWithSort({
								select,
								where,
								sort,
								params: json.params,
							});
						},
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	sessionEndpoints.openapi(
		createRoute({
			method: "post",
			path: "/listing/count",
			description: "Returns count of listings based on provided query",
			operationId: "apiListingCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
				},
			},
			tags: [
				"listing",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "listing:count",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCount({
						select: withListingSelect(),
						filter,
						where,
						query({ select, where }) {
							return withListingQueryBuilder({
								select,
								where,
							});
						},
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	session.route("/", sessionEndpoints);
};
