import { z } from "zod";
import { IgnoreQuerySchema } from "~/server/@buyer/ignore/schema/IgnoreQuerySchema";

export const IgnoreCountQuerySchema = z
	.looseObject({
		...IgnoreQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "IgnoreCountQuery",
		description: "Query object for ignore count",
	});

export type IgnoreCountQuerySchema = typeof IgnoreCountQuerySchema;

export namespace IgnoreCountQuerySchema {
	export type Type = z.infer<IgnoreCountQuerySchema>;
}
