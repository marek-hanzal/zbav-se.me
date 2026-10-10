import { z } from "zod";

/**
 * Cursor schema used for pagination support.
 *
 * @group schema
 */
export const CursorSchema = z
	.looseObject({
		/**
		 * Page.
		 */
		page: z
			.number()
			.gte(0, "Page must be greater than zero")
			.describe("Page you want to retrieve; collections are 0-based"),
		/**
		 * Page size.
		 */
		size: z
			.number()
			.gte(1, "Page size must be greater than one to get any data")
			.describe("Page size you want to get"),
	})
	.strip()
	.meta({
		id: "Cursor",
		description: "Pagination cursor data; for 0-based collections",
	});

export type CursorSchema = typeof CursorSchema;

export namespace CursorSchema {
	export type Type = z.infer<CursorSchema>;
}
