import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { MessageSchema } from "../../schema/MessageSchema";
import { withListingQueryBuilder } from "./db/withListingQueryBuilder";
import { withListingSelect } from "./db/withListingSelect";
import { ListingQuerySchema } from "./schema/ListingQuerySchema";
import { ListingSchema } from "./schema/ListingSchema";

export const withListingFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
				"listing",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where, sort, meta } = json;
			const user = c.get("user");

			const { data, hit } = await withCache({
				key: {
					scope: "listing:fetch",
					version: "1",
					value: {
						userId: user.id,
						query: json,
					},
				},
				fetch: () =>
					withFetch({
						select: withListingSelect({
							sort,
							meta,
							userId: user.id,
						}),
						output: ListingSchema,
						filter,
						where,
						query(query) {
							return withListingQueryBuilder({
								userId: user.id,
								...query,
							});
						},
					}),
			});

			if (!data) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Listing not found",
					},
					404,
				);
			}
			return c.json<ListingSchema.Type, 200>(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
