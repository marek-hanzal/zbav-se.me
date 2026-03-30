import { z } from "zod";
import { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";

export const FlagCountWhereSchema = z
	.looseObject({
		...FlagFilterSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "FlagCountWhere",
		description: "App-based filters",
	});

export type FlagCountWhereSchema = typeof FlagCountWhereSchema;

export namespace FlagCountWhereSchema {
	export type Type = z.infer<FlagCountWhereSchema>;
}
