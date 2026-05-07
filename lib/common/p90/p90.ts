/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
export const p90 = (sorted: number[]) => {
	const n = sorted.length;
	if (n === 0) {
		return 0;
	}
	const idx = Math.min(n - 1, Math.max(0, Math.ceil(n * 0.9) - 1));
	return sorted[idx]!;
};
