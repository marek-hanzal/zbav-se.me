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
import { AppEnv } from "../AppEnv";
import { HandleUploadBodySchema } from "../content/schema/HandleUploadBodySchema";
import { HandleUploadResponseSchema } from "../content/schema/HandleUploadResponseSchema";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withTokenHono } from "../hono/withTokenHono";
import { PayloadSchema } from "../jwt/PayloadSchema";
import { sign } from "../jwt/sign";
import { withCache } from "../redis/withCache";
import { CountSchema } from "../schema/CountSchema";
import { ListingCreateSchema } from "./schema/ListingCreateSchema";
import { ListingDtoSchema } from "./schema/ListingDtoSchema";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import { ListingSchema } from "./schema/ListingSchema";
import {
	withListingQueryBuilder,
	withListingQueryBuilderWithSort,
} from "./withListingQueryBuilder";

export const withListingApi: Routes.Fn = ({ session, token }) => {
	const sessionEndpoints = withSessionHono();
	const tokenEndpoints = withTokenHono();

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
				200: {
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

			return c.json({
				...listing,
				upload: await sign({
					schema: PayloadSchema,
					issuer: AppEnv.VITE_API,
					scope: "/api/token/listing/gallery/upload",
					secret: AppEnv.JWT_SECRET,
					userId: user.id,
					subject: listing.id,
					expiresIn: "18m",
				}),
			});
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

	tokenEndpoints.openapi(
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
				"listing",
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
								href: "/api/token/listing/gallery/upload",
							}),
							tokenPayload: JSON.stringify(
								ListingGalleryPayload.parse(
									JSON.parse(clientPayload ?? "{}"),
								),
							),
						};
					},
					async onUploadCompleted({ blob, tokenPayload }) {
						const user = c.get("user");
						const payload = ListingGalleryPayload.parse(
							JSON.parse(tokenPayload ?? "{}"),
						);

						/**
						 * Be sure request comes to the right listing
						 */
						const listing = await database.kysely
							.selectFrom("listing")
							.where("id", "=", payload.listingId)
							.where("userId", "=", user.id)
							.selectAll()
							.executeTakeFirstOrThrow();

						await database.kysely
							.insertInto("gallery")
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

	session.route("/", sessionEndpoints);
	token.route("/", tokenEndpoints);
};
