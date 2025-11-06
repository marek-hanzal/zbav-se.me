import { createHash } from "node:crypto";

export namespace embedMinHash {
	export interface Props {
		value: string;
		dimensions: number;
	}
}

function computeBitPattern64(normalizedText: string): Float32Array {
	const bitWeights = new Int32Array(64);
	const minGram = 3;
	const maxGram = 5;

	for (let n = minGram; n <= maxGram; n++) {
		for (let i = 0; i + n <= normalizedText.length; i++) {
			const gram = normalizedText.slice(i, i + n);

			const digest = createHash("sha256").update(gram).digest();
			for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
				// biome-ignore lint/style/noNonNullAssertion: We're OK
				const byte = digest[byteIndex]!;
				for (let bit = 0; bit < 8; bit++) {
					const isSet = (byte & (1 << (7 - bit))) !== 0;
					const globalBit = byteIndex * 8 + bit;
					const target = globalBit;
					// biome-ignore lint/style/noNonNullAssertion: We're OK
					bitWeights[target]! += isSet ? 1 : -1;
				}
			}
		}
	}

	const pattern = new Float32Array(64);
	for (let b = 0; b < 64; b++) {
		// biome-ignore lint/style/noNonNullAssertion: We're OK
		pattern[b] = bitWeights[b]! >= 0 ? 1 : -1;
	}
	return pattern;
}

export const embedMinHash = ({ value, dimensions }: embedMinHash.Props) => {
	const output = new Float32Array(dimensions);

	const normalized = value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]+/g, "")
		.trim();

	if (!normalized) return output;

	const bitPattern = computeBitPattern64(normalized);

	for (let i = 0; i < dimensions; i++) {
		// biome-ignore lint/style/noNonNullAssertion: We're OK
		output[i] = bitPattern[i % 64]!;
	}
	return output;
};
