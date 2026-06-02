import { z } from "zod";
import { FlagWhereSchema } from "./FlagWhereSchema";

export const FlagCountWhereSchema = z
	.looseObject({
		...FlagWhereSchema.shape,
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
