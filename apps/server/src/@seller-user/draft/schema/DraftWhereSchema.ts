import { z } from "@hono/zod-openapi";
import { DraftFilterSchema } from "~/@seller-user/draft/schema/DraftFilterSchema";

export const DraftWhereSchema = z
	.looseObject({
		...DraftFilterSchema.shape,
	})
	.strip()
	.openapi("DraftWhere", {
		description: "App-based filters",
	});

export type DraftWhereSchema = typeof DraftWhereSchema;

export namespace DraftWhereSchema {
	export type Type = z.infer<DraftWhereSchema>;
}
