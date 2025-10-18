import { clamp } from "@use-pico/common";
import {
	type RefObject,
	useCallback,
	useEffect,
	useEffectEvent,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export namespace useSnapperNav {
	export interface Props {
		/**
		 * Scrollable container ref.
		 */
		containerRef: RefObject<HTMLElement | null>;
		/**
		 * Scroll axis.
		 */
		orientation: "horizontal" | "vertical";
		/**
		 * Total page count (SSR-friendly).
		 */
		count: number;
		/**
		 * Initial page index (0-based).
		 */
		defaultIndex?: number;
		/**
		 * Quantization threshold 0..1; default 0.5.
		 */
		threshold?: number;
		/**
		 * Called when a new page index is derived.
		 */
		onSnap?: (index: number) => void;
	}

	/**
	 * Page index or a CSS selector scoped to the container.
	 */
	export type SnapTarget = number | string;

	export interface Result {
		current: number;
		count: number;
		isFirst: boolean;
		isLast: boolean;
		start: () => void;
		end: () => void;
		next: () => void;
		prev: () => void;
		snapTo: (target: SnapTarget, behavior?: ScrollBehavior) => void;
	}
}

/**
 * Minimal page snap navigator (count-driven, SSR-friendly).
 * A "page" equals the container viewport (clientWidth/Height).
 */
export function useSnapperNav({
	containerRef,
	orientation,
	count,
	defaultIndex = 0,
	threshold = 0.5,
	onSnap,
}: useSnapperNav.Props): useSnapperNav.Result {
	const $count = Math.max(1, Math.floor(count));
	const isVertical = orientation === "vertical";
	const $threshold = clamp(threshold, 0, 1);

	const [current, setCurrent] = useState(() => {
		const last = $count - 1;
		return clamp(defaultIndex, 0, last);
	});
	const currentRef = useRef(current);
	currentRef.current = current;

	/**
	 * Emit wrapper that always sees the latest `onSnap`.
	 * Emission is centralized in effects (no emit from `snapTo`).
	 */
	const emitSnap = useEffectEvent((idx: number) => onSnap?.(idx));

	const metrics = useCallback(() => {
		const host = containerRef.current;

		if (!host) {
			return {
				pageSize: 1,
				position: 0,
				totalSize: 1,
			};
		}

		const pageSize = isVertical ? host.clientHeight : host.clientWidth;
		const position = isVertical ? host.scrollTop : host.scrollLeft;
		const totalSize = isVertical ? host.scrollHeight : host.scrollWidth;

		return {
			pageSize: Math.max(1, pageSize),
			position,
			totalSize: Math.max(1, totalSize),
		};
	}, [
		containerRef,
		isVertical,
	]);

	const quantizeToPageIndex = useCallback(
		(position: number, pageSize: number, pageCount: number) => {
			const raw = (position + pageSize * $threshold) / pageSize;
			const last = Math.max(0, pageCount - 1);
			return clamp(Math.floor(raw), 0, last);
		},
		[
			$threshold,
		],
	);

	const toDirectChild = useCallback(
		(node: Element | null): HTMLElement | null => {
			const host = containerRef.current;

			if (!host || !node) {
				return null;
			}

			let cursor: Element | null = node;

			while (cursor && cursor.parentElement !== host) {
				cursor = cursor.parentElement;
			}

			if (!cursor || cursor.parentElement !== host) {
				return null;
			}

			return cursor as HTMLElement;
		},
		[
			containerRef,
		],
	);

	/**
	 * Programmatic scroll to page (by index or selector).
	 * Does not emit; scroll listener derives and emits.
	 */
	const snapTo = useCallback(
		(
			target: useSnapperNav.SnapTarget,
			behavior: ScrollBehavior = "smooth",
		) => {
			const host = containerRef.current;

			if (!host) {
				return;
			}

			let pageIndex: number;

			if (typeof target === "number") {
				pageIndex = clamp(Math.floor(target), 0, $count - 1);
			} else {
				const found = host.querySelector(target);
				const child = toDirectChild(found);

				if (!child) {
					return;
				}

				const { pageSize } = metrics();
				const offset = isVertical ? child.offsetTop : child.offsetLeft;
				pageIndex = clamp(Math.floor(offset / pageSize), 0, $count - 1);
			}

			const { pageSize, totalSize, position } = metrics();
			const maxScroll = Math.max(0, totalSize - pageSize);
			const targetPx = clamp(pageIndex * pageSize, 0, maxScroll);

			const EPS = 1;
			if (Math.abs(position - targetPx) <= EPS) {
				return;
			}

			if (isVertical) {
				host.scrollTo({
					top: targetPx,
					behavior,
				});
			} else {
				host.scrollTo({
					left: targetPx,
					behavior,
				});
			}
		},
		[
			containerRef,
			isVertical,
			$count,
			metrics,
			toDirectChild,
		],
	);

	const start = useCallback(() => {
		snapTo(0);
	}, [
		snapTo,
	]);

	const end = useCallback(() => {
		snapTo($count - 1);
	}, [
		snapTo,
		$count,
	]);

	const next = useCallback(() => {
		snapTo(currentRef.current + 1);
	}, [
		snapTo,
	]);

	const prev = useCallback(() => {
		snapTo(currentRef.current - 1);
	}, [
		snapTo,
	]);

	/**
	 * Initial mount / host swap:
	 * - Snap to a safe initial page (auto)
	 * - Derive `current` from actual metrics (and emit if changed)
	 */
	useLayoutEffect(() => {
		const el = containerRef.current;

		if (!el) {
			return;
		}

		const initial = clamp(defaultIndex, 0, $count - 1);

		if (initial !== currentRef.current) {
			snapTo(initial, "auto");
		}

		const { pageSize, position } = metrics();
		const idx = quantizeToPageIndex(position, pageSize, $count);

		if (idx !== currentRef.current) {
			currentRef.current = idx;
			setCurrent(idx);
		}
	}, [
		containerRef,
		defaultIndex,
		$count,
		snapTo,
		metrics,
		quantizeToPageIndex,
	]);

	/**
	 * Scroll listener:
	 * - Derives page index and emits only on change.
	 */
	useEffect(() => {
		const el = containerRef.current;

		if (!el) {
			return;
		}

		const host = el;

		function onScroll() {
			const { pageSize, position } = metrics();
			const idx = quantizeToPageIndex(position, pageSize, $count);

			if (idx !== currentRef.current) {
				currentRef.current = idx;
				setCurrent(idx);
				emitSnap?.(idx);
			}
		}

		host.addEventListener("scroll", onScroll, {
			passive: true,
		});

		return () => {
			host.removeEventListener("scroll", onScroll);
		};
	}, [
		containerRef,
		$count,
		metrics,
		quantizeToPageIndex,
		emitSnap,
	]);

	/**
	 * Count changes:
	 * - Clamp current to the new range and snap if needed (auto).
	 */
	useEffect(() => {
		const last = Math.max(0, $count - 1);
		const clamped = clamp(currentRef.current, 0, last);

		if (clamped !== currentRef.current) {
			currentRef.current = clamped;
			setCurrent(clamped);
			snapTo(clamped, "auto");
			emitSnap?.(clamped);
		}
	}, [
		$count,
		snapTo,
		emitSnap,
	]);

	const isFirst = current === 0;
	const isLast = current === Math.max(0, $count - 1);

	return {
		current,
		count: $count,
		isFirst,
		isLast,
		start,
		end,
		next,
		prev,
		snapTo,
	};
}
