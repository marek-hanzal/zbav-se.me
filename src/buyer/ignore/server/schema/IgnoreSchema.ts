import { z } from "zod";
import { IgnoreTableSchema } from "~/server/database/@table/IgnoreTableSchema";

export const IgnoreSchema = z
	.looseObject({
		...IgnoreTableSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Ignore",
		description: "Ignore data",
	});

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
