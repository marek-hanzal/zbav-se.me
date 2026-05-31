import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { FlagSortSchema } from "~/buyer/flag/server/schema/FlagSortSchema";
import { FlagWhereSchema } from "~/buyer/flag/server/schema/FlagWhereSchema";

export const FlagQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: FlagWhereSchema.optional(),
		sort: FlagSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
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
