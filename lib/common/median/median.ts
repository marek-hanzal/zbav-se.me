/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
export const median = (sorted: number[]) => {
	const n = sorted.length;
	if (n === 0) {
		return 0;
	}
	const mid = Math.floor(n / 2);
	return n % 2 === 1 ? sorted[mid]! : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
};
