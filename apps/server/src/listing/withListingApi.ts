import { createRoute, z } from "@hono/zod-openapi";
import { genId, withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
import { CountSchema } from "../schema/CountSchema";
import { ErrorSchema } from "../schema/ErrorSchema";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingDtoSchema } from "./schema/ListingDtoSchema";
import { ListingGalleryCreateSchema } from "./schema/ListingGalleryCreateSchema";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import { ListingSchema } from "./schema/ListingSchema";
import {
	withListingQueryBuilder,
	withListingQueryBuilderWithSort,
} from "./withListingQueryBuilder";

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

			const listing = await database.kysely
				.insertInto("listing")
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

			return c.json(listing satisfies ListingDtoSchema.Type, 201);
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
						select: database.kysely
							.selectFrom("listing")
							.selectAll(),
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
					withList({
						select: database.kysely
							.selectFrom("listing")
							.selectAll(),
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
						select: database.kysely
							.selectFrom("listing")
							.selectAll(),
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

	sessionEndpoints.openapi(
		createRoute({
			method: "post",
			path: "/listing/gallery/create",
			description: "Add an image to a listing's gallery",
			operationId: "apiListingGalleryCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingGalleryCreateSchema,
						},
					},
					description:
						"Data for adding an image to the listing's gallery",
				},
			},
			responses: {
				201: {
					description: "Gallery item created successfully",
				},
				403: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description:
						"Forbidden - listing not found or no permission",
				},
			},
			tags: [
				"listing",
			],
		}),
		async (c) => {
			const data = c.req.valid("json");
			const user = c.get("user");
			const now = new Date();

			// Verify that the listing belongs to the user
			const listing = await database.kysely
				.selectFrom("listing")
				.select("id")
				.where("id", "=", data.listingId)
				.where("userId", "=", user.id)
				.executeTakeFirst();

			if (!listing) {
				return c.json(
					{
						error: "Nope. Shoo. I don't like you!",
					},
					403,
				);
			}

			// Insert the gallery item
			await database.kysely
				.insertInto("gallery")
				.values({
					id: genId(),
					userId: user.id,
					listingId: data.listingId,
					url: data.url,
					sort: data.sort,
					createdAt: now,
					updatedAt: now,
				})
				.execute();

			return c.json(null, 201);
		},
	);

	session.route("/", sessionEndpoints);
};
