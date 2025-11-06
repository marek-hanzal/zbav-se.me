import { unit } from "../unit";

export namespace embedNumberRange {
	export interface Props {
		value: number;
		min: number;
		max: number;
		dimensions: number;
		weight: number;
	}
}

/**
 * Embeds a number within a range into a vector.
 * Creates a distribution centered at the normalized value position.
 */
export const embedNumberRange = ({
	value,
	min,
	max,
	dimensions,
	weight,
}: embedNumberRange.Props): Float32Array<ArrayBuffer> => {
	// Clamp value to range
	const clamped = Math.max(min, Math.min(max, value));
	// Normalize to [0, 1]
	const normalized = (clamped - min) / (max - min);
	// Map to dimension index [0, dimensions-1]
	const targetIndex = Math.floor(normalized * (dimensions - 1));

	const vector = new Float32Array(dimensions);

	// Create a distribution around the target index
	// Use a Gaussian-like distribution for smooth similarity
	for (let i = 0; i < dimensions; i++) {
		const distance = Math.abs(i - targetIndex);
		// Use exponential decay for smooth distribution
		// Scale by 2 to make it more concentrated
		vector[i] = Math.exp(-(distance * distance) / 2);
	}

	// Apply weight
	for (let i = 0; i < dimensions; i++) {
		// biome-ignore lint/style/noNonNullAssertion: We're ok here
		vector[i]! *= weight;
	}

	return unit(vector);
};
