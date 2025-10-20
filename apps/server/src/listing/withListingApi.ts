import { createRoute, z } from "@hono/zod-openapi";
import {
	genId,
	linkTo,
	withCount,
	withFetch,
	withList,
} from "@use-pico/common";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { ListingGalleryPayload } from "@zbav-se.me/common";
import { HandleUploadBodySchema } from "../content/schema/HandleUploadBodySchema";
import { HandleUploadResponseSchema } from "../content/schema/HandleUploadResponseSchema";
import { database } from "../database/kysely";
import { AppEnv } from "../env";
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

withListingApi.openapi(
	createRoute({
		method: "post",
		path: "/listing/gallery/upload",
		description: "Upload a photo to the listing gallery",
		operationId: "apiListingGalleryUpload",
		request: {
			body: {
				content: {
					"application/json": {
						schema: HandleUploadBodySchema,
					},
				},
				required: true,
				description: "Request body consumed by @vercel/blob/client",
			},
		},
		responses: {
			200: {
				description: "Response consumed by @vercel/blob/client",
				content: {
					"application/json": {
						schema: HandleUploadResponseSchema,
					},
				},
			},
		},
		tags: [
			"content",
		],
	}),
	async (c) => {
		return c.json(
			await handleUpload({
				request: c.req.raw,
				body: c.req.valid("json") satisfies HandleUploadBody,
				token: AppEnv.VERCEL_BLOB,
				async onBeforeGenerateToken(pathname, clientPayload) {
					const user = c.get("user");
					if (!pathname.startsWith(`/${user.id}/`)) {
						throw new Error(
							"Unauthorized: Path must start with user ID",
						);
					}

					return {
						allowedContentTypes: [
							"image/jpeg",
							"image/png",
							"image/webp",
							"image/avif",
						],
						addRandomSuffix: true,
						allowOverwrite: false,
						cacheControlMaxAge: 60 * 60 * 24 * 30,
						maximumSizeInBytes: 16 * 1024 * 1024,
						callbackUrl: linkTo({
							base: AppEnv.VITE_API,
							href: "/api/content/upload",
						}),
						tokenPayload: JSON.stringify(
							ListingGalleryPayload.parse(clientPayload),
						),
					};
				},
				async onUploadCompleted({ blob, tokenPayload }) {
					const user = c.get("user");
					const payload = ListingGalleryPayload.parse(
						JSON.parse(tokenPayload ?? "{}"),
					);

					const listing = await database.kysely
						.selectFrom("Listing")
						.where("id", "=", payload.listingId)
						.where("userId", "=", user.id)
						.selectAll()
						.executeTakeFirstOrThrow();

					await database.kysely
						.insertInto("Gallery")
						.values({
							id: genId(),
							createdAt: new Date(),
							listingId: listing.id,
							updatedAt: new Date(),
							url: linkTo({
								base: "https://content.zbav-se.me",
								href: blob.pathname,
							}),
							sort: payload.sort,
							userId: user.id,
						})
						.execute();
				},
			}),
		);
	},
);
