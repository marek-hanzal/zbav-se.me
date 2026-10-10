import { type Ref, type RefCallback, useMemo } from "react";

function assignRefFn<T>(
	ref: Ref<T> | undefined | null,
	value: T | null,
): ReturnType<RefCallback<T>> {
	if (typeof ref === "function") {
		return ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

function mergeRefsFn<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
	return (value: T | null) => {
		const cleanups: (() => void)[] = [];

		for (const ref of refs) {
			const cleanupFn = assignRefFn(ref, value);
			const isCleanup = typeof cleanupFn === "function";

			cleanups.push(isCleanup ? cleanupFn : () => assignRefFn(ref, null));
		}

		return () => {
			for (const cleanupFn of cleanups) {
				cleanupFn();
			}
		};
	};
}

export function useMergeRefs<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
	// biome-ignore lint/correctness/useExhaustiveDependencies: We're ok here, don't cry.
	return useMemo(() => mergeRefsFn(refs), refs);
}
