import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { ListingCountQuerySchema } from "../schema/ListingCountQuerySchema";
import { withListingQueryBuilder } from "../withListingQueryBuilder";
import { withListingSelect } from "../withListingSelect";

export const withListingCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/count",
			description: "Returns count of listings based on provided query",
			operationId: "apiListingCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCountQuerySchema,
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
				"session",
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
						select: withListingSelect({
							sort: undefined,
							meta: undefined,
						}),
						filter,
						where,
						query: withListingQueryBuilder,
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
