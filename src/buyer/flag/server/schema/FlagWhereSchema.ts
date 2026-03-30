import { z } from "zod";
import { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";

export const FlagWhereSchema = z
	.looseObject({
		...FlagFilterSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "FlagWhere",
		description: "App-based filters",
	});

export type FlagWhereSchema = typeof FlagWhereSchema;

export namespace FlagWhereSchema {
	export type Type = z.infer<FlagWhereSchema>;
}
