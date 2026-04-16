import { z } from "zod";
import { FeedFilterSchema } from "./FeedFilterSchema";

export const FeedToolFilterSchema = z
	.looseObject({
		...FeedFilterSchema.shape,
	})
	.omit({
		userId: true,
		idIn: true,
	})
	.strip();

export type FeedToolFilterSchema = typeof FeedToolFilterSchema;

export namespace FeedToolFilterSchema {
	export type Type = z.infer<FeedToolFilterSchema>;
}
