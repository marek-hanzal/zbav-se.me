export namespace toEnumGuard {
	export type Complete<TGuard extends string, TEnum extends readonly TGuard[]> = [
		Exclude<TGuard, TEnum[number]>,
	] extends [
		never,
	]
		? TEnum
		: never;
}

export function toEnumGuard<TGuard extends string>() {
	return <const TEnum extends readonly TGuard[]>(input: toEnumGuard.Complete<TGuard, TEnum>) =>
		input;
}
