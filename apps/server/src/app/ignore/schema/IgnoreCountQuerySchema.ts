import type { z } from "@hono/zod-openapi";
import { IgnoreQuerySchema } from "./IgnoreQuerySchema";

export const IgnoreCountQuerySchema = IgnoreQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("IgnoreCountQuery", {
	description: "Query object for ignore count",
});

export type IgnoreCountQuerySchema = typeof IgnoreCountQuerySchema;

export namespace IgnoreCountQuerySchema {
	export type Type = z.infer<IgnoreCountQuerySchema>;
}
