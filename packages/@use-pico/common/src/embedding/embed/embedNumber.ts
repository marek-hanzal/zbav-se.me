import { unit } from "../unit";

export namespace embedNumber {
	export interface Props {
		value: number;
		hasher(input: string): bigint;
		order: "asc" | "desc";
		dimensions: number;
		weight: number;
	}
}

/**
 * Embeds a number into a vector with ascending or descending order.
 * Uses hash-based distribution to create a consistent vector representation.
 */
export const embedNumber = ({
	value,
	hasher,
	order,
	dimensions,
	weight,
}: embedNumber.Props): Float32Array<ArrayBuffer> => {
	const hash = hasher(value.toString());
	const vector = new Float32Array(dimensions);

	// Distribute hash across dimensions
	for (let i = 0; i < dimensions; i++) {
		// Create a seed from hash and dimension index
		const seed = Number(
			(hash + BigInt(i * 2654435761)) % BigInt(2147483647),
		);
		const normalized = Math.abs(seed) / 2147483647;

		// Apply order: for desc, invert the value
		const orderedValue = order === "asc" ? normalized : 1 - normalized;

		// Scale by the original value to maintain magnitude information
		const scaled = orderedValue * (1 + Math.abs(value) / 1000);
		vector[i] = scaled;
	}

	// Apply weight
	for (let i = 0; i < dimensions; i++) {
		// biome-ignore lint/style/noNonNullAssertion: We're ok here
		vector[i]! *= weight;
	}

	return unit(vector);
};
