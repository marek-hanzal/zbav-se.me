import { z } from "zod";
import { FlagCountWhereSchema } from "~/buyer/flag/server/schema/FlagCountWhereSchema";

export const FlagCountQuerySchema = z
	.looseObject({
		where: FlagCountWhereSchema.optional(),
	})
	.strip()
	.meta({
		id: "FlagCountQuery",
		description: "Query object for flag count",
	});

export type FlagCountQuerySchema = typeof FlagCountQuerySchema;

export namespace FlagCountQuerySchema {
	export type Type = z.infer<FlagCountQuerySchema>;
}
