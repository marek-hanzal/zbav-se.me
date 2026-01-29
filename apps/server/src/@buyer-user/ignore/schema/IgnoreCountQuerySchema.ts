import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { IgnoreQuerySchema } from "~/@buyer-user/ignore/schema/IgnoreQuerySchema";

export const IgnoreCountQuerySchema = z
	.looseObject({
		...IgnoreQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("IgnoreCountQuery", {
		description: "Query object for ignore count",
	});

export type IgnoreCountQuerySchema = typeof IgnoreCountQuerySchema;

export namespace IgnoreCountQuerySchema {
	export type Type = z.infer<IgnoreCountQuerySchema>;
}
