import { z } from "@hono/zod-openapi";
import { IgnoreQuerySchema } from "~/@buyer/ignore/schema/IgnoreQuerySchema";

export const IgnoreCountQuerySchema = z
	.looseObject({
		...IgnoreQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("IgnoreCountQuery", {
		description: "Query object for ignore count",
	});

export type IgnoreCountQuerySchema = typeof IgnoreCountQuerySchema;

export namespace IgnoreCountQuerySchema {
	export type Type = z.infer<IgnoreCountQuerySchema>;
}
