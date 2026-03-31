import { type Ref, type RefCallback, useMemo } from "react";

function assignRef<T>(ref: Ref<T> | undefined | null, value: T | null): ReturnType<RefCallback<T>> {
	if (typeof ref === "function") {
		return ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

function mergeRefs<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
	return (value: T | null) => {
		const cleanups: (() => void)[] = [];

		for (const ref of refs) {
			const cleanup = assignRef(ref, value);
			const isCleanup = typeof cleanup === "function";

			cleanups.push(isCleanup ? cleanup : () => assignRef(ref, null));
		}

		return () => {
			for (const cleanup of cleanups) {
				cleanup();
			}
		};
	};
}

export function useMergeRefs<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
	// biome-ignore lint/correctness/useExhaustiveDependencies: We're ok here, don't cry.
	return useMemo(() => mergeRefs(refs), refs);
}
