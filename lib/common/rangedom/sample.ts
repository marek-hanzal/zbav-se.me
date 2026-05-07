export const sample = <T>(items: readonly T[], count: number): T[] => {
	if (items.length === 0 || count <= 0) {
		return [];
	}

	const targetCount = Math.min(items.length, count);
	const picked = new Set<number>();
	const result: T[] = [];

	while (result.length < targetCount) {
		const index = Math.floor(Math.random() * items.length);
		if (picked.has(index)) {
			continue;
		}

		const item = items[index];
		if (item === undefined) {
			continue;
		}

		picked.add(index);
		result.push(item);
	}

	return result;
};
