import { createHash } from "node:crypto";

function simhash64(text: string): bigint {
	const normalized = text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/\p{Diacritic}+/gu, "")
		.trim();

	if (!normalized) return 0n;

	const bitWeights = new Int32Array(64);
	const minGram = 3;
	const maxGram = 5;

	for (let n = minGram; n <= maxGram; n++) {
		for (let i = 0; i + n <= normalized.length; i++) {
			const gram = normalized.slice(i, i + n);
			const digest = createHash("sha256").update(gram).digest();
			const hash64 = digest.readBigUInt64BE(0);

			for (let bit = 0; bit < 64; bit++) {
				const isSet = (hash64 >> BigInt(bit)) & 1n;
				const idx = 63 - bit;
				// biome-ignore lint/style/noNonNullAssertion: We're OK here
				bitWeights[idx]! = (bitWeights[idx]! +
					(isSet === 1n ? 1 : -1)) as number;
			}
		}
	}

	let fingerprint = 0n;
	for (let bit = 0; bit < 64; bit++) {
		// biome-ignore lint/style/noNonNullAssertion: We're OK here
		if (bitWeights[bit]! >= 0) {
			fingerprint |= 1n << BigInt(63 - bit);
		}
	}
	return fingerprint;
}

export namespace embedMinHash {
	export interface Props {
		value: string;
		dimensions?: number;
	}
}

export const embedMinHash = ({
	value,
	dimensions = 64,
}: embedMinHash.Props) => {
	const output = new Float32Array(dimensions);

	const normalized = value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/\p{Diacritic}+/gu, "")
		.trim();

	if (!normalized) {
		return output;
	}

	const fingerprint = simhash64(normalized);

	const pattern = new Float32Array(64);
	for (let i = 0; i < 64; i++) {
		const rev = 63 - i;
		const isSet = ((fingerprint >> BigInt(rev)) & 1n) === 1n;
		pattern[i] = isSet ? 1 : -1;
	}

	for (let i = 0; i < dimensions; i++) {
		// biome-ignore lint/style/noNonNullAssertion: We're OK here
		output[i] = pattern[i % 64]!;
	}

	return output;
};
