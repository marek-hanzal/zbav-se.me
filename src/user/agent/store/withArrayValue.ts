export const withArrayValue = <T>({
	source,
	index,
	valueFx,
}: {
	source: T[];
	index: number;
	valueFx(value: T | undefined): T;
}): T[] => {
	const next = [
		...source,
	];

	next[index] = valueFx(source[index]);

	return next;
};
