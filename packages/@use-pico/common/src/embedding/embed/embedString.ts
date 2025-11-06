import { unit } from "../unit";

export namespace embedString {
	export interface Props {
		value: string;
		hasher(input: string): bigint;
		dimensions: number;
		weight: number;
	}
}

/**
 * Embeds a string into a vector using a hasher function.
 * Distributes the hash value across the vector dimensions.
 */
export const embedString = ({
	value,
	hasher,
	dimensions,
	weight,
}: embedString.Props): Float32Array => {
	const hash = hasher(value);
	const vector = new Float32Array(dimensions);

	// Distribute hash across dimensions
	// Use multiple hash iterations to fill all dimensions
	for (let i = 0; i < dimensions; i++) {
		// Create a seed from hash and dimension index
		const seed = Number(
			(hash + BigInt(i * 2654435761)) % BigInt(2147483647),
		);
		const normalized = Math.abs(seed) / 2147483647;

		// Use sine/cosine to create more varied distribution
		const angle = normalized * Math.PI * 2;
		vector[i] = Math.sin(angle) * Math.cos(angle * 1.618); // Golden ratio for variety
	}

	// Apply weight
	for (let i = 0; i < dimensions; i++) {
		// biome-ignore lint/style/noNonNullAssertion: We're ok here
		vector[i]! *= weight;
	}

	return unit(vector);
};
