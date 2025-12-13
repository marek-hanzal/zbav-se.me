import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import {
	Activity,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";
import { BottomSheet } from "../bottom-sheet";

export namespace SheetView {
	export interface View extends Partial<BottomSheet.Props> {
		children: ReactNode;
	}

	export interface Props<TView extends string> extends Omit<BottomSheet.Props, "children"> {
		state: StateType.State<TView>;
		views: Record<TView, View>;
	}
}

export const SheetView = <TView extends string>({
	state,
	views,
	contentProps,
	...props
}: SheetView.Props<TView>) => {
	const { children: _, ...current } = views[state.value];

	const scrollElementRef = useRef<HTMLDivElement | null>(null);
	const scrollPositionsRef = useRef(new Map<TView, number>());
	const currentViewRef = useRef(state.value);
	const attachedElementsRef = useRef<Set<HTMLElement>>(new Set());
	const rafIdRef = useRef<number | null>(null);

	currentViewRef.current = state.value;

	// Create scroll handler once
	const scrollHandlerRef = useRef<((e: Event) => void) | null>(null);
	if (!scrollHandlerRef.current) {
		scrollHandlerRef.current = () => {
			const element = scrollElementRef.current;
			if (!element) return;

			if (rafIdRef.current !== null) return;

			rafIdRef.current = requestAnimationFrame(() => {
				rafIdRef.current = null;
				scrollPositionsRef.current.set(currentViewRef.current, element.scrollTop);
			});
		};
	}

	// Find scrollable element (element itself or a child)
	const findScrollableElement = useCallback((element: HTMLElement): HTMLElement | null => {
		const style = window.getComputedStyle(element);
		const isScrollable =
			(style.overflowY === "auto" || style.overflowY === "scroll") &&
			element.scrollHeight > element.clientHeight;

		if (isScrollable) {
			return element;
		}

		for (const child of Array.from(element.children)) {
			const result = findScrollableElement(child as HTMLElement);
			if (result) return result;
		}

		return null;
	}, []);

	// Attach scroll listener to element and its scrollable children
	const attachScrollListeners = useCallback((element: HTMLDivElement | null) => {
		const handler = scrollHandlerRef.current;
		if (!handler) return;

		// Remove all previously attached listeners
		for (const el of attachedElementsRef.current) {
			el.removeEventListener("scroll", handler);
		}
		attachedElementsRef.current.clear();

		if (!element) return;

		// Attach to element itself
		element.addEventListener("scroll", handler, {
			passive: true,
		});
		attachedElementsRef.current.add(element);

		// Find and attach to scrollable children
		const scrollableChildren = Array.from(element.querySelectorAll("*")).filter((el) => {
			const htmlEl = el as HTMLElement;
			return (
				htmlEl.scrollHeight > htmlEl.clientHeight &&
				(window.getComputedStyle(htmlEl).overflowY === "auto" ||
					window.getComputedStyle(htmlEl).overflowY === "scroll")
			);
		});
		for (const child of scrollableChildren) {
			(child as HTMLElement).addEventListener("scroll", handler, {
				passive: true,
			});
			attachedElementsRef.current.add(child as HTMLElement);
		}
	}, []);

	// Restore scroll position helper
	const restoreScroll = useCallback((element: HTMLDivElement, view: TView) => {
		const savedPosition = scrollPositionsRef.current.get(view) ?? 0;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (scrollElementRef.current === element) {
					element.scrollTop = savedPosition;
				}
			});
		});
	}, []);

	// Watch for scrollRef changes and find actual scrollable element
	const prevScrollElementRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const element = scrollElementRef.current;
		if (element === prevScrollElementRef.current) return;
		prevScrollElementRef.current = element;

		if (!element) return;

		attachScrollListeners(element);

		// Wait for DOM to settle, then find and attach to actual scrollable element
		const handler = scrollHandlerRef.current;
		const timeoutId = setTimeout(() => {
			const scrollable = findScrollableElement(element);
			if (scrollable && scrollable !== element && handler) {
				scrollable.addEventListener("scroll", handler, {
					passive: true,
				});
				attachedElementsRef.current.add(scrollable);
			}
		}, 200);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [
		attachScrollListeners,
		findScrollableElement,
	]);

	// Restore scroll position when view changes
	useLayoutEffect(() => {
		const element = scrollElementRef.current;
		if (!element) return;
		restoreScroll(element, state.value);
	}, [
		state.value,
		restoreScroll,
	]);

	// Cleanup on unmount
	useLayoutEffect(() => {
		return () => {
			attachScrollListeners(null);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [
		attachScrollListeners,
	]);

	// Proxy RefObject for react-modal-sheet library
	const scrollRef = useMemo(() => {
		return {
			get current() {
				return scrollElementRef.current;
			},
			set current(node: HTMLDivElement | null) {
				scrollElementRef.current = node;
				attachScrollListeners(node);
				if (node) {
					restoreScroll(node, currentViewRef.current);
				}
			},
		} as React.RefObject<HTMLDivElement>;
	}, [
		attachScrollListeners,
		restoreScroll,
	]);

	return (
		<BottomSheet
			{...props}
			{...current}
			contentProps={{
				...contentProps,
				scrollRef,
			}}
		>
			{entriesOf(views).map(([view, { children }]) => (
				<Activity
					key={view}
					mode={state.value === view ? "visible" : "hidden"}
				>
					{children}
				</Activity>
			))}
		</BottomSheet>
	);
};
