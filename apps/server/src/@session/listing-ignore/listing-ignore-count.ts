import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { withListingIgnoreQueryBuilder } from "./db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "./db/withListingIgnoreSelect";
import { ListingIgnoreCountQuerySchema } from "./schema/ListingIgnoreCountQuerySchema";

export const withListingIgnoreCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-ignore/count",
			description:
				"Returns count of listing ignore items based on provided query",
			operationId: "apiListingIgnoreCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingIgnoreCountQuerySchema,
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
				"listing-ignore",
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
					scope: "listing-ignore:count",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCount({
						select: withListingIgnoreSelect({
							sort: undefined,
						}),
						filter,
						where: userWhere,
						query: withListingIgnoreQueryBuilder,
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
