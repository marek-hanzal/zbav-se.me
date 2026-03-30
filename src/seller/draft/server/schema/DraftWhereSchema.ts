import { z } from "zod";
import { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";

export const DraftWhereSchema = z
	.looseObject({
		...DraftFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "DraftWhere",
		description: "App-based filters",
	});

export type DraftWhereSchema = typeof DraftWhereSchema;

export namespace DraftWhereSchema {
	export type Type = z.infer<DraftWhereSchema>;
}
