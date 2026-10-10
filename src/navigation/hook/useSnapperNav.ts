import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
	type RefObject,
	useCallback,
	useEffect,
	useEffectEvent,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { clampFn } from "~/number/fn/clampFn";

export namespace useSnapperNav {
	export interface Props {
		containerRef: RefObject<HTMLElement | null>;
		orientation: "horizontal" | "vertical";
		count: number;
		defaultIndex?: number;
		threshold?: number;
		debounce?: number;
		onSnapFn?: (index: number) => void;
	}

	export type SnapTarget = number | string;

	export interface State {
		current: number;
		count: number;
		isFirst: boolean;
		isLast: boolean;
	}

	export interface Api {
		startFn: () => void;
		endFn: () => void;
		nextFn: () => void;
		prevFn: () => void;
		snapToFn: (target: SnapTarget, behavior?: ScrollBehavior) => void;
	}

	export interface Result {
		state: State;
		api: Api;
	}
}

export function useSnapperNav({
	containerRef,
	orientation,
	count,
	defaultIndex = 0,
	threshold = 0.5,
	debounce = 150,
	onSnapFn,
}: useSnapperNav.Props): useSnapperNav.Result {
	const totalCount = Math.max(1, Math.floor(count));
	const isVertical = orientation === "vertical";
	const clampedThreshold = clampFn(threshold, 0, 1);

	const [current, setCurrentFn] = useState(() => clampFn(defaultIndex, 0, totalCount - 1));
	const currentRef = useRef(current);
	currentRef.current = current;

	const emitSnapFn = useEffectEvent((index: number) => {
		onSnapFn?.(index);
	});

	const emitSnapDebouncedFn = useDebouncedCallback((index: number) => emitSnapFn(index), {
		key: "useSnapperNav",
		wait: debounce,
		leading: false,
		trailing: true,
	});

	// --- helpers ---------------------------------------------------------------

	const getChildSizeFn = useCallback(
		(element: HTMLElement) =>
			Math.max(1, isVertical ? element.clientHeight : element.clientWidth),
		[
			isVertical,
		],
	);

	const getChildOffsetFn = useCallback(
		(element: HTMLElement) => (isVertical ? element.offsetTop : element.offsetLeft),
		[
			isVertical,
		],
	);

	/**
	 * Read scroll metrics. Page size (stride) is:
	 *   - offset(second) - offset(first), if both exist and stride > 0
	 *   - else size(first), if first exists
	 *   - else container client size
	 */
	const readMetricsFn = useCallback(() => {
		const host = containerRef.current;
		if (!host)
			return {
				pageSize: 1,
				position: 0,
				totalSize: 1,
			};

		const position = isVertical ? host.scrollTop : host.scrollLeft;
		const totalSize = Math.max(1, isVertical ? host.scrollHeight : host.scrollWidth);
		const clientSize = Math.max(1, isVertical ? host.clientHeight : host.clientWidth);

		let pageSize = clientSize;

		const children = host.children as HTMLCollectionOf<HTMLElement>;
		const first = children.item(0);
		const second = children.item(1);

		const firstSize = first ? getChildSizeFn(first) : clientSize;
		const stride = first && second ? getChildOffsetFn(second) - getChildOffsetFn(first) : 0;

		pageSize = Math.max(1, stride > 0 ? stride : firstSize);

		return {
			pageSize,
			position,
			totalSize,
		};
	}, [
		containerRef,
		isVertical,
		getChildOffsetFn,
		getChildSizeFn,
	]);

	const positionToIndexFn = useCallback(
		(position: number, pageSize: number, total: number) => {
			const raw = (position + pageSize * clampedThreshold) / pageSize;
			return clampFn(Math.floor(raw), 0, Math.max(0, total - 1));
		},
		[
			clampedThreshold,
		],
	);

	const toDirectChildFn = useCallback(
		(node: Element | null): HTMLElement | null => {
			const host = containerRef.current;
			if (!host || !node) return null;
			let cursor: Element | null = node;
			while (cursor && cursor.parentElement !== host) cursor = cursor.parentElement;
			if (!cursor || cursor.parentElement !== host) return null;
			return cursor as HTMLElement;
		},
		[
			containerRef,
		],
	);

	// --- navigation API --------------------------------------------------------

	const snapToFn = useCallback(
		(target: useSnapperNav.SnapTarget, behavior: ScrollBehavior = "smooth") => {
			const host = containerRef.current;
			if (!host) return;

			let pageIndex: number;
			if (typeof target === "number") {
				pageIndex = clampFn(Math.floor(target), 0, totalCount - 1);
			} else {
				const found = host.querySelector(target);
				const directChild = toDirectChildFn(found);
				if (!directChild) return;

				const { pageSize } = readMetricsFn();
				const raw =
					(isVertical ? directChild.offsetTop : directChild.offsetLeft) / pageSize;
				pageIndex = clampFn(Math.round(raw), 0, totalCount - 1);
			}

			const { pageSize, totalSize, position } = readMetricsFn();
			const maxScroll = Math.max(0, totalSize - pageSize);
			const targetPixels = clampFn(pageIndex * pageSize, 0, maxScroll);

			const EPSILON = 2;
			if (Math.abs(position - targetPixels) <= EPSILON) return;

			if (isVertical)
				host.scrollTo({
					top: targetPixels,
					behavior,
				});
			else
				host.scrollTo({
					left: targetPixels,
					behavior,
				});
		},
		[
			containerRef,
			isVertical,
			totalCount,
			readMetricsFn,
			toDirectChildFn,
		],
	);

	const startFn = useCallback(
		() => snapToFn(0),
		[
			snapToFn,
		],
	);
	const endFn = useCallback(
		() => snapToFn(totalCount - 1),
		[
			snapToFn,
			totalCount,
		],
	);
	const nextFn = useCallback(
		() => snapToFn(currentRef.current + 1),
		[
			snapToFn,
		],
	);
	const prevFn = useCallback(
		() => snapToFn(currentRef.current - 1),
		[
			snapToFn,
		],
	);

	// --- lifecycle -------------------------------------------------------------

	useLayoutEffect(() => {
		const host = containerRef.current;
		if (!host) {
			return;
		}

		const initialIndex = clampFn(defaultIndex, 0, totalCount - 1);
		const { pageSize, totalSize } = readMetricsFn();
		const maxScroll = Math.max(0, totalSize - pageSize);
		const targetPixels = clampFn(initialIndex * pageSize, 0, maxScroll);

		if (isVertical)
			host.scrollTo({
				top: targetPixels,
				behavior: "auto",
			});
		else
			host.scrollTo({
				left: targetPixels,
				behavior: "auto",
			});

		currentRef.current = initialIndex;
		setCurrentFn(initialIndex);

		const { position } = readMetricsFn();
		const derivedIndex = positionToIndexFn(position, pageSize, totalCount);
		if (derivedIndex !== initialIndex) {
			currentRef.current = derivedIndex;
			setCurrentFn(derivedIndex);
		}
	}, [
		containerRef,
		defaultIndex,
		totalCount,
		isVertical,
		readMetricsFn,
		positionToIndexFn,
	]);

	useLayoutEffect(() => {
		const host = containerRef.current;
		if (!host) {
			return;
		}

		function handleScrollFn() {
			const { pageSize, position } = readMetricsFn();
			const newIndex = positionToIndexFn(position, pageSize, totalCount);
			if (newIndex !== currentRef.current) {
				currentRef.current = newIndex;
				setCurrentFn(newIndex);
				emitSnapDebouncedFn(newIndex);
			}
		}

		host.addEventListener("scroll", handleScrollFn, {
			passive: true,
		});
		return () => host.removeEventListener("scroll", handleScrollFn);
	}, [
		containerRef,
		totalCount,
		readMetricsFn,
		positionToIndexFn,
		emitSnapDebouncedFn,
	]);

	useEffect(() => {
		const clampedIndex = clampFn(currentRef.current, 0, totalCount - 1);
		if (clampedIndex !== currentRef.current) {
			currentRef.current = clampedIndex;
			setCurrentFn(clampedIndex);
			emitSnapDebouncedFn(clampedIndex);
		}
	}, [
		totalCount,
		emitSnapDebouncedFn,
	]);

	// --- result ---------------------------------------------------------------

	const state = useMemo<useSnapperNav.State>(
		() => ({
			current,
			count: totalCount,
			isFirst: current === 0,
			isLast: current === Math.max(0, totalCount - 1),
		}),
		[
			current,
			totalCount,
		],
	);

	const api = useMemo<useSnapperNav.Api>(
		() => ({
			startFn,
			endFn,
			nextFn,
			prevFn,
			snapToFn,
		}),
		[
			startFn,
			endFn,
			nextFn,
			prevFn,
			snapToFn,
		],
	);

	return {
		state,
		api,
	};
}
