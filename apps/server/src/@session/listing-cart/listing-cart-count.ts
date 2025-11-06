import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { withListingCartQueryBuilder } from "./db/withListingCartQueryBuilder";
import { withListingCartSelect } from "./db/withListingCartSelect";
import { ListingCartCountQuerySchema } from "./schema/ListingCartCountQuerySchema";

export const withListingCartCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-cart/count",
			description:
				"Returns count of listing cart items based on provided query",
			operationId: "apiListingCartCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCartCountQuerySchema,
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
				"listing-cart",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const user = c.get("user");
			const { filter, where } = json;

			// Always filter by current user
			const userWhere = {
				...where,
				userId: user.id,
			};

			const { data, hit } = await withCache({
				key: {
					scope: "listing-cart:count",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCount({
						select: withListingCartSelect({
							sort: undefined,
						}),
						filter,
						where: userWhere,
						query: withListingCartQueryBuilder,
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
