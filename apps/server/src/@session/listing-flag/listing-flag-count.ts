import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { withListingFlagQueryBuilder } from "./db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "./db/withListingFlagSelect";
import { ListingFlagCountQuerySchema } from "./schema/ListingFlagCountQuerySchema";

export const withListingFlagCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-flag/count",
			description: "Returns count of listing flag items based on provided query",
			operationId: "apiListingFlagCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingFlagCountQuerySchema,
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
				"listing-flag",
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
					scope: "listing-flag:count",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCount({
						select: withListingFlagSelect({
							sort: undefined,
						}),
						filter,
						where: userWhere,
						query: withListingFlagQueryBuilder,
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
