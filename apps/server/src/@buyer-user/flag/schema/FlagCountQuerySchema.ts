import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { FlagFilterSchema } from "~/@buyer-user/flag/schema/FlagFilterSchema";
import { FlagCountWhereSchema } from "~/@buyer-user/flag/schema/FlagCountWhereSchema";

export const FlagCountQuerySchema = z
	.looseObject({
		filter: FlagFilterSchema.omit({
			userId: true,
		}).optional(),
		where: FlagCountWhereSchema.optional(),
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("FlagCountQuery", {
		description: "Query object for flag count",
	});

export type FlagCountQuerySchema = typeof FlagCountQuerySchema;

export namespace FlagCountQuerySchema {
	export type Type = z.infer<FlagCountQuerySchema>;
}
