import { z } from "@hono/zod-openapi";
import { ListingScoreDbSchema } from "./ListingScoreDbSchema";

export const ListingScoreSchema = z
	.object({
		...ListingScoreDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("ListingScore");

export type ListingScoreSchema = typeof ListingScoreSchema;

export namespace ListingScoreSchema {
	export type Type = z.infer<ListingScoreSchema>;
}
