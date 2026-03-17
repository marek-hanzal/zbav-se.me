import { z } from "@hono/zod-openapi";

export const ListingStatusEnumSchema = z
	.enum([
		"live",
		"sold",
		"on-hold",
		"banned",
	])
	.openapi("ListingStatusEnum", {
		description: "Status of the listing",
	});

export type ListingStatusEnumSchema = typeof ListingStatusEnumSchema;

export namespace ListingStatusEnumSchema {
	export type Type = z.infer<ListingStatusEnumSchema>;
}
