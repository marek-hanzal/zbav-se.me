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
		page: z.number().gte(0, "Page must be greater than zero"),
		/**
		 * Page size.
		 */
		size: z.number().gte(1, "Page size must be greater than one to get any data"),
	})
	.strip()
	.meta({
		id: "Cursor",
		description: "Pagination cursor data",
	});

export type CursorSchema = typeof CursorSchema;

export namespace CursorSchema {
	export type Type = z.infer<CursorSchema>;
}
