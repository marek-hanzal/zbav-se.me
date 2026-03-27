import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { FeedTypeEnumSchema } from "~/@common/feed/enum/FeedTypeEnumSchema";

export const FeedFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		type: FeedTypeEnumSchema.optional().meta({
			description: "Exact feed type",
		}),
	})
	.strip()
	.meta({
		id: "FeedFilter",
		description: "Filter object for feed collection",
	});

export type FeedFilterSchema = typeof FeedFilterSchema;

export namespace FeedFilterSchema {
	export type Type = z.infer<FeedFilterSchema>;
}
