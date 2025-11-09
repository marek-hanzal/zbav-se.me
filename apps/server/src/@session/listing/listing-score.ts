import { createRoute, z } from "@hono/zod-openapi";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingScoreSchema } from "./schema/ListingScoreSchema";

const ListingScoreParamsSchema = z
	.object({
		id: z.string().openapi({
			description: "Listing identifier",
		}),
	})
	.openapi("ListingScoreParams", {
		description: "What we need to fetch listing score",
	});

export const withListingScoreFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "get",
			path: "/listing/{id}/score",
			description: "Return score for a listing",
			operationId: "apiListingScore",
			request: {
				params: ListingScoreParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingScoreSchema,
						},
					},
					description: "Listing score for the provided identifier",
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
			const { id } = c.req.valid("param");

			const count = await database.kysely
				.selectFrom("listing_score as ls")
				.select((eb) => [
					eb.fn.count<number>("ls.id").as("count"),
				])
				.where("ls.listingId", "=", id)
				.executeTakeFirstOrThrow();

			if (Number(count.count) === 0) {
				return c.json<MessageSchema.Type, 404>(
					{
						message: "Listing has no score yet",
						type: "error",
					},
					404,
				);
			}

			const score = await database.kysely
				.selectFrom("listing_score as ls")
				.where("ls.listingId", "=", id)
				.select((eb) => [
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "listing")
								.then(1)
								.else(0)
								.end(),
						)
						.as("listing"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "listing")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("listingScore"),
					//
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "view")
								.then(1)
								.else(0)
								.end(),
						)
						.as("views"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "view")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("viewsScore"),
					//
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "cart")
								.then(1)
								.else(0)
								.end(),
						)
						.as("cart"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "cart")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("cartScore"),
					//
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "ignore")
								.then(1)
								.else(0)
								.end(),
						)
						.as("ignore"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "ignore")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("ignoreScore"),
					//
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "flag")
								.then(1)
								.else(0)
								.end(),
						)
						.as("flag"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "flag")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("flagScore"),
					eb.fn.sum<number>("ls.score").as("score"),
				])
				.executeTakeFirst();

			return c.json<ListingScoreSchema.Type, 200>(
				ListingScoreSchema.parse(score),
				200,
			);
		},
	);
};
