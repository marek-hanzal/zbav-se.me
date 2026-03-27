import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { FlagFilterSchema } from "~/server/@buyer/flag/schema/FlagFilterSchema";
import { FlagSortSchema } from "~/server/@buyer/flag/schema/FlagSortSchema";
import { FlagWhereSchema } from "~/server/@buyer/flag/schema/FlagWhereSchema";

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
	.meta({
		id: "FlagQuery",
		description: "Query object for flag collection",
	});

export type FlagQuerySchema = typeof FlagQuerySchema;

export namespace FlagQuerySchema {
	export type Type = z.infer<FlagQuerySchema>;
}
