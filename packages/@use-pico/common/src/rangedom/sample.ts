export const sample = <T>(items: readonly T[], count: number): T[] => {
	if (items.length === 0 || count <= 0) {
		return [];
	}

	const copy = Array.from(items);
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const current = copy[i];
		const target = copy[j];

		if (current === undefined || target === undefined) {
			continue;
		}

		copy[i] = target;
		copy[j] = current;
	}

	return copy.slice(0, Math.min(copy.length, count));
};
