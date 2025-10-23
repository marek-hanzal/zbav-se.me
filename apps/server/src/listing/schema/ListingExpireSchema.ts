import { z } from "@hono/zod-openapi";

export const ListingExpireSchema = z
	.enum([
		"7-days",
		"14-days",
		"1-month",
	])
	.openapi("ListingExpire", {
		description: "Expiration period for the listing",
	});

export type ListingExpireSchema = typeof ListingExpireSchema;

export namespace ListingExpireSchema {
	export type Type = z.infer<typeof ListingExpireSchema>;
}
