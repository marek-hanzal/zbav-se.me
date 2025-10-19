import { createRoute, z } from "@hono/zod-openapi";
import { genId, withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import { CountSchema } from "../schema/CountSchema";
import { withSessionHono } from "../withSessionHono";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import { ListingSchema } from "./schema/ListingSchema";
import {
	withListingQueryBuilder,
	withListingQueryBuilderWithSort,
} from "./withListingQueryBuilder";

export const withListingApi = withSessionHono();

withListingApi.openapi(
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
			200: {
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
		],
	}),
	async (c) => {
		const data = c.req.valid("json");
		const user = c.get("user");
		const id = genId();
		const now = new Date();

		const listing = await database.kysely
			.insertInto("Listing")
			.values({
				id,
				userId: user.id,
				price: data.price,
				condition: data.condition,
				age: data.age,
				locationId: data.locationId,
				categoryGroupId: data.categoryGroupId,
				categoryId: data.categoryId,
				createdAt: now,
				updatedAt: now,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return c.json(listing);
	},
);

withListingApi.openapi(
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
						schema: ListingSchema,
					},
				},
				description: "Return a listing based on the provided query",
			},
		},
		tags: [
			"listing",
		],
	}),
	async ({ json, req }) => {
		const { filter, where, sort } = req.valid("json");

		return json(
			await withFetch({
				select: database.kysely.selectFrom("Listing").selectAll(),
				output: ListingSchema,
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
		);
	},
);

withListingApi.openapi(
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
						schema: z.array(ListingSchema),
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
	async ({ json, req }) => {
		const { cursor, filter, where, sort } = req.valid("json");
		return json(
			await withList({
				select: database.kysely.selectFrom("Listing").selectAll(),
				output: ListingSchema,
				cursor,
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
		);
	},
);

withListingApi.openapi(
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
	async ({ json, req }) => {
		const { filter, where } = req.valid("json");
		return json(
			await withCount({
				select: database.kysely.selectFrom("Listing").selectAll(),
				filter,
				where,
				query({ select, where }) {
					return withListingQueryBuilder({
						select,
						where,
					});
				},
			}),
		);
	},
);
