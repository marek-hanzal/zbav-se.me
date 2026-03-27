import { z } from "zod";

/**
 * Zod schema for vector type (Float32Array with 192 dimensions)
 */
export const VectorSchema = z
	.union([
		z.instanceof(Float32Array),
		z.array(z.number()).transform((arr) => new Float32Array(arr)),
	])
	.meta({
		id: "Vector",
		type: "array",
		items: {
			type: "number",
		},
		description: "Embedding vector (array of numbers)",
	});

export type VectorSchema = typeof VectorSchema;

export namespace VectorSchema {
	export type Type = z.infer<VectorSchema>;
}
