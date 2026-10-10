export namespace toEnumGuardFn {
	export type Complete<TGuard extends string, TEnum extends readonly TGuard[]> = [
		Exclude<TGuard, TEnum[number]>,
	] extends [
		never,
	]
		? TEnum
		: never;
}

export function toEnumGuardFn<TGuard extends string>() {
	return <const TEnum extends readonly TGuard[]>(
		input: toEnumGuardFn.Complete<TGuard, TEnum>,
	) => {
		return input;
	};
}
