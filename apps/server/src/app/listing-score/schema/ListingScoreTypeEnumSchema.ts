import { z } from "@hono/zod-openapi";

export const ListingScoreTypeEnumSchema = z
	.enum([
		"listing",
		"ignore",
		"flag",
		"view",
		"cart",
	])
	.openapi("ListingScoreTypeEnum", {
		description: "Type of listing score",
	});

export type ListingScoreTypeEnumSchema = typeof ListingScoreTypeEnumSchema;

export namespace ListingScoreTypeEnumSchema {
	export type Type = z.infer<ListingScoreTypeEnumSchema>;
}
