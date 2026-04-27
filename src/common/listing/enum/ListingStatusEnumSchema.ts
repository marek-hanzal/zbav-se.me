import { z } from "zod";

export const ListingStatusEnumSchema = z
	.enum([
		"draft",
		"live",
		"sold",
		"on-hold",
		"banned",
	])
	.meta({
		id: "ListingStatusEnum",
		description: "Status of the listing",
	});

export type ListingStatusEnumSchema = typeof ListingStatusEnumSchema;

export namespace ListingStatusEnumSchema {
	export type Type = z.infer<ListingStatusEnumSchema>;
}
