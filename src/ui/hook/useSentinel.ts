import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export namespace useSentinel {
	export interface Props<TElement extends HTMLElement> {
		containerRef: RefObject<HTMLElement | null>;
		sentinelRef: RefObject<TElement | null>;
		threshold?: number;
		onEnterFn?(): void;
		onLeaveFn?(): void;
	}

	export interface Result {
		inView: boolean;
	}
}

type useSentinelObserved = {
	root: HTMLElement | null;
	sentinel: HTMLElement | null;
	threshold: number;
};

export function useSentinel<TElement extends HTMLElement>({
	containerRef,
	sentinelRef,
	threshold = 1,
	onEnterFn,
	onLeaveFn,
}: useSentinel.Props<TElement>): useSentinel.Result {
	const [inView, setInViewFn] = useState(false);

	const ioRef = useRef<IntersectionObserver | null>(null);
	const lastRef = useRef<boolean | null>(null);
	const observedRef = useRef<useSentinelObserved>({
		root: null,
		sentinel: null,
		threshold,
	});
	const latestRef = useRef({
		threshold,
		onEnterFn,
		onLeaveFn,
	});
	latestRef.current.threshold = threshold;
	latestRef.current.onEnterFn = onEnterFn;
	latestRef.current.onLeaveFn = onLeaveFn;

	const disconnectFn = useCallback(() => {
		if (!ioRef.current) {
			return;
		}
		ioRef.current.disconnect();
		ioRef.current = null;
		lastRef.current = null;
	}, []);

	const resetFn = useCallback(() => {
		observedRef.current = {
			root: null,
			sentinel: null,
			threshold: latestRef.current.threshold,
		};
		disconnectFn();
		setInViewFn(false);
	}, [
		disconnectFn,
	]);

	const connectFn = useCallback(
		(root: HTMLElement, sentinel: HTMLElement) => {
			disconnectFn();

			const io = new IntersectionObserver(
				([entry]) => {
					if (!entry) {
						return;
					}

					const next =
						entry.isIntersecting &&
						entry.intersectionRatio >= latestRef.current.threshold;
					if (lastRef.current === next) {
						return;
					}

					lastRef.current = next;
					setInViewFn(next);

					if (next) {
						latestRef.current.onEnterFn?.();
						return;
					}

					latestRef.current.onLeaveFn?.();
				},
				{
					root,
					threshold: latestRef.current.threshold,
				},
			);

			io.observe(sentinel);
			ioRef.current = io;
		},
		[
			disconnectFn,
		],
	);

	const syncFn = useCallback(() => {
		const root = containerRef.current;
		const sentinel = sentinelRef.current;
		const {
			root: observedRoot,
			sentinel: observedSentinel,
			threshold: observedThreshold,
		} = observedRef.current;

		if (!root || !sentinel) {
			resetFn();
			return;
		}

		if (
			observedRoot === root &&
			observedSentinel === sentinel &&
			observedThreshold === latestRef.current.threshold
		) {
			return;
		}

		observedRef.current = {
			root,
			sentinel,
			threshold: latestRef.current.threshold,
		};
		connectFn(root, sentinel);
	}, [
		connectFn,
		containerRef,
		resetFn,
		sentinelRef,
	]);

	useEffect(() => {
		syncFn();

		const root = containerRef.current;
		if (!root) {
			return;
		}

		const mo = new MutationObserver(() => {
			syncFn();
		});

		mo.observe(root, {
			childList: true,
			subtree: true,
		});

		return () => {
			mo.disconnect();
			disconnectFn();
		};
	}, [
		containerRef,
		disconnectFn,
		syncFn,
	]);

	return {
		inView,
	};
}
