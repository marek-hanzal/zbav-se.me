import { type DependencyList, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EntitySchema } from "~/entity/schema/EntitySchema";

export namespace useSelection {
	/** Selection mode - either single item or multiple items */
	export type Mode = "single" | "multi";

	/** Props for configuring the selection hook */
	export interface Props<T extends EntitySchema.Type> {
		mode: Mode; // Assumed static during component lifetime
		initial?: T[];
		deps?: DependencyList;
		/** Called in single mode when exactly one item is selected (always with value) */
		onSingleFn?: (item: T) => void;
		/** Called on any change (including empty) — also in single mode */
		onMultiFn?: (items: T[]) => void;
		/** Called in single mode with the selected item or undefined */
		onSelectFn?: (item: T | undefined) => void;
	}

	export interface Required<T extends EntitySchema.Type> {
		singleFn(): T;
		singleIdFn(): string;
		multiFn(): [
			T,
			...T[],
		];
		multiIdFn(): [
			string,
			...string[],
		];
	}

	export interface Optional<T extends EntitySchema.Type> {
		singleFn(): T | undefined;
		singleIdFn(): string | undefined;
		multiFn(): T[];
		multiIdFn(): string[];
	}

	export interface Use<T extends EntitySchema.Type> {
		selection: T[];
		mode: Mode;

		setFn(items: T[]): void;
		singleFn(item: T): void;
		multiFn(item: T): void;
		toggleFn(item: T): void;
		removeFn(item: T): void;

		isSelectedFn(id: string): boolean;
		hasAny: boolean;

		/** Clear selection */
		clearFn(): void;
		/** Count of selected items */
		count: number;

		/** Return true if ANY of provided items are selected */
		someFn(items: T[]): boolean;
		/** Return true if ALL of provided items are selected */
		everyFn(items: T[]): boolean;

		required: Required<T>;
		optional: Optional<T>;
	}
}

export function useSelection<T extends EntitySchema.Type>({
	mode,
	initial = [],
	deps = [],
	onSingleFn,
	onMultiFn,
	onSelectFn,
}: useSelection.Props<T>): useSelection.Use<T> {
	const [selection, setSelectionFn] = useState<T[]>(() => normalizeFn(initial, mode));
	const selectionRef = useRef(selection);
	selectionRef.current = selection;
	const isInitialDepsEffectRef = useRef(true);

	/** Dispatch callbacks immediately from actions (never on mount) */
	const dispatchFn = useCallback(
		(next: T[]) => {
			if (mode === "single") {
				const item = next[0];
				onSelectFn?.(item);
				if (item) onSingleFn?.(item);
				// Always notify onMulti even in single mode (including empty)
				onMultiFn?.(next);
				return;
			}
			// Multi mode: always report (including empty)
			onMultiFn?.(next);
		},
		[
			mode,
			onMultiFn,
			onSelectFn,
			onSingleFn,
		],
	);

	useEffect(() => {
		if (isInitialDepsEffectRef.current) {
			isInitialDepsEffectRef.current = false;
			return;
		}

		const normalized = normalizeFn(initial, mode);
		selectionRef.current = normalized;
		setSelectionFn(normalized);
		dispatchFn(normalized);
		// biome-ignore lint/correctness/useExhaustiveDependencies: deps is the hook API; callers decide when initial should be re-applied
	}, deps);

	/** Centralized setter that normalizes and dispatches */
	const applyFn = useCallback(
		(next: T[]) => {
			const normalized = normalizeFn(next, mode);
			selectionRef.current = normalized;
			setSelectionFn(normalized);
			dispatchFn(normalized);
		},
		[
			mode,
			dispatchFn,
		],
	);

	/** Replace with exactly one item */
	const singleFn = useCallback(
		(item: T) => {
			applyFn([
				item,
			]);
		},
		[
			applyFn,
		],
	);

	/** Add to multi (no duplicates). If already present, still dispatch current state. */
	const multiFn = useCallback(
		(item: T) => {
			const prev = selectionRef.current;
			if (prev.some((p) => p.id === item.id)) {
				applyFn(prev);
				return;
			}
			applyFn([
				...prev,
				item,
			]);
		},
		[
			applyFn,
		],
	);

	/** Toggle respecting current mode */
	const toggleFn = useCallback(
		(item: T) => {
			const prev = selectionRef.current;
			const idx = prev.findIndex((p) => p.id === item.id);

			if (mode === "single") {
				applyFn(
					idx >= 0
						? []
						: [
								item,
							],
				);
				return;
			}

			if (idx >= 0) {
				const next = prev.slice();
				next.splice(idx, 1);
				applyFn(next);
				return;
			}

			applyFn([
				...prev,
				item,
			]);
		},
		[
			mode,
			applyFn,
		],
	);

	/** Remove specific item */
	const removeFn = useCallback(
		(item: T) => {
			const prev = selectionRef.current;
			applyFn(prev.filter((p) => p.id !== item.id));
		},
		[
			applyFn,
		],
	);

	/** Clear selection */
	const clearFn = useCallback(() => {
		applyFn([]);
	}, [
		applyFn,
	]);

	/** Replace with items (normalized inside) */
	const setFn = useCallback(
		(items: T[]) => {
			applyFn(items);
		},
		[
			applyFn,
		],
	);

	// ----- Derived helpers (stable) -----
	const requiredSingleFn = useCallback((): T => {
		if (mode === "single" && selection.length === 1) {
			const it = selection[0];
			if (!it) throw new Error("Invalid selection state");
			return it;
		}
		throw new Error("No item selected in single mode");
	}, [
		mode,
		selection,
	]);

	const requiredSingleIdFn = useCallback(
		(): string => requiredSingleFn().id,
		[
			requiredSingleFn,
		],
	);

	const requiredMultiFn = useCallback((): [
		T,
		...T[],
	] => {
		if (selection.length === 0) {
			throw new Error("No items selected in multi mode");
		}
		return selection as [
			T,
			...T[],
		];
	}, [
		selection,
	]);

	const requiredMultiIdFn = useCallback((): [
		string,
		...string[],
	] => {
		if (selection.length === 0) {
			throw new Error("No items selected in multi mode");
		}
		return selection.map((x) => x.id) as [
			string,
			...string[],
		];
	}, [
		selection,
	]);

	const optionalSingleFn = useCallback(
		(): T | undefined => (selection.length >= 1 ? selection[0] : undefined),
		[
			selection,
		],
	);

	const optionalSingleIdFn = useCallback(
		(): string | undefined => (selection.length >= 1 ? selection[0]?.id : undefined),
		[
			selection,
		],
	);

	const optionalMultiFn = useCallback(
		(): T[] => selection,
		[
			selection,
		],
	);
	const optionalMultiIdFn = useCallback(
		(): string[] => selection.map((x) => x.id),
		[
			selection,
		],
	);

	const someFn = useCallback(
		(items: T[]): boolean => items.some((item) => selection.some((sel) => sel.id === item.id)),
		[
			selection,
		],
	);

	const everyFn = useCallback(
		(items: T[]): boolean => items.every((item) => selection.some((sel) => sel.id === item.id)),
		[
			selection,
		],
	);

	return useMemo(
		() => ({
			selection,
			mode,
			singleFn,
			multiFn,
			toggleFn,
			removeFn,
			setFn,

			isSelectedFn: (id: string) => selection.some((p) => p.id === id),
			hasAny: selection.length > 0,

			clearFn,
			count: selection.length,

			someFn,
			everyFn,

			required: {
				singleFn: requiredSingleFn,
				singleIdFn: requiredSingleIdFn,
				multiFn: requiredMultiFn,
				multiIdFn: requiredMultiIdFn,
			},
			optional: {
				singleFn: optionalSingleFn,
				singleIdFn: optionalSingleIdFn,
				multiFn: optionalMultiFn,
				multiIdFn: optionalMultiIdFn,
			},
		}),
		[
			selection,
			mode,
			singleFn,
			multiFn,
			toggleFn,
			removeFn,
			setFn,
			clearFn,
			requiredSingleFn,
			requiredSingleIdFn,
			requiredMultiFn,
			requiredMultiIdFn,
			optionalSingleFn,
			optionalSingleIdFn,
			optionalMultiFn,
			optionalMultiIdFn,
			someFn,
			everyFn,
		],
	);
}

// ========================================================================================

/** Deduplicate by id, keep first occurrence */
function dedupeByIdFn<T extends EntitySchema.Type>(arr: readonly T[]): T[] {
	const seen = new Set<string>();
	const out: T[] = [];
	for (const it of arr) {
		if (!seen.has(it.id)) {
			seen.add(it.id);
			out.push(it);
		}
	}
	return out;
}

function normalizeFn<T extends EntitySchema.Type>(
	selection: readonly T[],
	mode: useSelection.Mode,
): T[] {
	const cleaned = dedupeByIdFn(selection);
	return mode === "single" ? cleaned.slice(0, 1) : cleaned;
}
