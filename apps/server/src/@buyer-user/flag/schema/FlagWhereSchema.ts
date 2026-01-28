import { z } from "@hono/zod-openapi";
import { FlagFilterSchema } from "~/@buyer-user/flag/schema/FlagFilterSchema";

export const FlagWhereSchema = z
	.looseObject({
		...FlagFilterSchema.shape,
	})
    .omit({ userId: true })
    .strip()
	.openapi("FlagWhere", {
		description: "App-based filters",
	});

export type FlagWhereSchema = typeof FlagWhereSchema;

export namespace FlagWhereSchema {
	export type Type = z.infer<FlagWhereSchema>;
}
