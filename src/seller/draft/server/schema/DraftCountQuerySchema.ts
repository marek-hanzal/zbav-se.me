import { z } from "zod";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";

export const DraftCountQuerySchema = z
	.looseObject({
		...DraftQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "DraftCountQuery",
		description: "Query object for draft count",
	});

export type DraftCountQuerySchema = typeof DraftCountQuerySchema;

export namespace DraftCountQuerySchema {
	export type Type = z.infer<DraftCountQuerySchema>;
}
