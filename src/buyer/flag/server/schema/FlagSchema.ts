import { z } from "zod";
import { FlagTableSchema } from "~/server/database/@table/FlagTableSchema";

export const FlagSchema = z
	.looseObject({
		...FlagTableSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Flag",
		description: "Flag data",
	});

export type FlagSchema = typeof FlagSchema;

export namespace FlagSchema {
	export type Type = z.infer<FlagSchema>;
}
