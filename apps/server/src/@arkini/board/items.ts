import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { ItemSchema } from "~/@arkini/schema/ItemSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withItemsApiFx = Effect.fn("withItemsApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "get",
			path: "/board/items",
			description: "Return current items on the board.",
			operationId: "apiBoardItems",
			request: {},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(ItemSchema),
						},
					},
					description: "Items on the board",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"Board",
			],
			summary: "Return current items on the board.",
		}),
		async (c) => {
			return c.json<ItemSchema.Type[], 200>([], 200);
		},
	);
});
