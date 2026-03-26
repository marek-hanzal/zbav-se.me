import { z } from "@hono/zod-openapi";
import { DraftQuerySchema } from "~/server/@seller/draft/schema/DraftQuerySchema";

export const DraftCountQuerySchema = z
	.looseObject({
		...DraftQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("DraftCountQuery", {
		description: "Query object for draft count",
	});

export type DraftCountQuerySchema = typeof DraftCountQuerySchema;

export namespace DraftCountQuerySchema {
	export type Type = z.infer<DraftCountQuerySchema>;
}
