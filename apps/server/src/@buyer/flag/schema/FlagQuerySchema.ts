import { z } from "@hono/zod-openapi";
import { FlagFilterSchema } from "~/@buyer/flag/schema/FlagFilterSchema";
import { FlagSortSchema } from "~/@buyer/flag/schema/FlagSortSchema";
import { FlagWhereSchema } from "~/@buyer/flag/schema/FlagWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const FlagQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FlagFilterSchema.omit({
			userId: true,
		}).optional(),
		where: FlagWhereSchema.optional(),
		sort: FlagSortSchema.array().optional(),
	})
	.strip()
	.openapi("FlagQuery", {
		description: "Query object for flag collection",
	});

export type FlagQuerySchema = typeof FlagQuerySchema;

export namespace FlagQuerySchema {
	export type Type = z.infer<FlagQuerySchema>;
}
