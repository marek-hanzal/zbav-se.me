import { z } from "@hono/zod-openapi";

/**
 * Zod schema for vector type (Float32Array with 192 dimensions)
 */
export const VectorSchema = z
	.union([
		z.instanceof(Float32Array),
		z.array(z.number()).transform((arr) => new Float32Array(arr)),
	])
	.openapi({
		type: "array",
		items: {
			type: "number",
		},
		description: "Embedding vector",
	});

export type VectorSchema = typeof VectorSchema;

export namespace VectorSchema {
	export type Type = z.infer<VectorSchema>;
}
