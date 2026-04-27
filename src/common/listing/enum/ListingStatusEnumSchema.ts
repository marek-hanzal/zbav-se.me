import { z } from "zod";

export const ListingStatusEnumSchema = z
	.enum([
		/**
		 * Not published, probably not ready (needs validation)
		 */
		"draft",
		/**
		 * Public live listing
		 */
		"live",
		/**
		 * Talkative enough
		 */
		"sold",
		/**
		 * Investigation needed
		 */
		"on-hold",
		/**
		 * Talkative enough
		 */
		"expired",
		/**
		 * When user manually closes the listing
		 */
		"closed",
		/**
		 * Talkative enough
		 */
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
