import { z } from "zod";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";

export const DraftSchema = z
	.looseObject({
		...DraftTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "Draft",
		description: "Draft data",
	});

export type DraftSchema = typeof DraftSchema;

export namespace DraftSchema {
	export type Type = z.infer<DraftSchema>;
}
