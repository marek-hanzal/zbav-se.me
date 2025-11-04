import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const FeedFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "Exact user id",
		}),
	})
	.openapi("FeedFilter", {
		description: "User-land filters for feed items",
	});

export type FeedFilterSchema = typeof FeedFilterSchema;

export namespace FeedFilterSchema {
	export type Type = z.infer<FeedFilterSchema>;
}
