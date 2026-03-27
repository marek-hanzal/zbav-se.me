import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export namespace useSentinel {
	export interface Props<TElement extends HTMLElement> {
		containerRef: RefObject<HTMLElement | null>;
		sentinelRef: RefObject<TElement | null>;
		threshold?: number;
		onEnter?(): void;
		onLeave?(): void;
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
	onEnter,
	onLeave,
}: useSentinel.Props<TElement>): useSentinel.Result {
	const [inView, setInView] = useState(false);

	const ioRef = useRef<IntersectionObserver | null>(null);
	const lastRef = useRef<boolean | null>(null);
	const observedRef = useRef<useSentinelObserved>({
		root: null,
		sentinel: null,
		threshold,
	});
	const latestRef = useRef({
		threshold,
		onEnter,
		onLeave,
	});
	latestRef.current.threshold = threshold;
	latestRef.current.onEnter = onEnter;
	latestRef.current.onLeave = onLeave;

	const disconnect = useCallback(() => {
		if (!ioRef.current) {
			return;
		}
		ioRef.current.disconnect();
		ioRef.current = null;
		lastRef.current = null;
	}, []);

	const reset = useCallback(() => {
		observedRef.current = {
			root: null,
			sentinel: null,
			threshold: latestRef.current.threshold,
		};
		disconnect();
		setInView(false);
	}, [
		disconnect,
	]);

	const connect = useCallback(
		(root: HTMLElement, sentinel: HTMLElement) => {
			disconnect();

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
					setInView(next);

					if (next) {
						latestRef.current.onEnter?.();
						return;
					}

					latestRef.current.onLeave?.();
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
			disconnect,
		],
	);

	const sync = useCallback(() => {
		const root = containerRef.current;
		const sentinel = sentinelRef.current;
		const {
			root: observedRoot,
			sentinel: observedSentinel,
			threshold: observedThreshold,
		} = observedRef.current;

		if (!root || !sentinel) {
			reset();
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
		connect(root, sentinel);
	}, [
		connect,
		containerRef,
		reset,
		sentinelRef,
	]);

	useEffect(() => {
		sync();

		const root = containerRef.current;
		if (!root) {
			return;
		}

		const mo = new MutationObserver(() => {
			sync();
		});

		mo.observe(root, {
			childList: true,
			subtree: true,
		});

		return () => {
			mo.disconnect();
			disconnect();
		};
	}, [
		containerRef,
		disconnect,
		sync,
	]);

	return {
		inView,
	};
}
