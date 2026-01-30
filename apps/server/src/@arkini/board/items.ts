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
			const mock: ItemSchema.Type[] = [
				{
					id: "wood-1",
					level: 1,
					x: 1,
					y: 2,
				},
				{
					id: "wood-2",
					level: 1,
					x: 2,
					y: 2,
				},
				{
					id: "wood-3",
					level: 1,
					x: 6,
					y: 4,
				},
				{
					id: "wood-4",
					level: 1,
					x: 7,
					y: 4,
				},
				{
					id: "wood-5",
					level: 2,
					x: 4,
					y: 1,
				},
				{
					id: "wood-6",
					level: 3,
					x: 0,
					y: 6,
				},
			];

			return c.json<ItemSchema.Type[], 200>(mock, 200);
		},
	);
});
