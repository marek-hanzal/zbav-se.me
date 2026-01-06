import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { FlagFilterSchema } from "./FlagFilterSchema";
import { FlagSortSchema } from "./FlagSortSchema";

export const FlagQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: FlagFilterSchema.omit({
			userId: true,
		}).optional(),
		where: FlagFilterSchema.omit({
			userId: true,
		})
			.openapi("FlagWhere", {
				description: "App-based filters",
			})
			.optional(),
		sort: FlagSortSchema.array().optional(),
	})
	.openapi("FlagQuery", {
		description: "Query object for flag collection",
	});

export type FlagQuerySchema = typeof FlagQuerySchema;

export namespace FlagQuerySchema {
	export type Type = z.infer<FlagQuerySchema>;
}
