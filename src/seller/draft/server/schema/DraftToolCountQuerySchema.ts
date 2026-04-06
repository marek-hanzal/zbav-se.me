import { z } from "zod";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const DraftToolCountQuerySchema = z
	.looseObject({
		...DraftToolQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "DraftToolCountQuery",
		description: "Query object for draft count",
	});

export type DraftToolCountQuerySchema = typeof DraftToolCountQuerySchema;

export namespace DraftToolCountQuerySchema {
	export type Type = z.infer<DraftToolCountQuerySchema>;
}
