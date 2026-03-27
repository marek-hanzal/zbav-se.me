import { z } from "@hono/zod-openapi";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const FeedFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Exact user id",
		}),
		type: FeedTypeEnumSchema.optional().openapi({
			description: "Exact feed type",
		}),
	})
	.strip()
	.openapi("FeedFilter", {
		description: "Filter object for feed collection",
	});

export type FeedFilterSchema = typeof FeedFilterSchema;

export namespace FeedFilterSchema {
	export type Type = z.infer<FeedFilterSchema>;
}
