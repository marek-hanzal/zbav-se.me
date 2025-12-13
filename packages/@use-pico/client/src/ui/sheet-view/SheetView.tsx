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
	const attachedElementRef = useRef<HTMLDivElement | null>(null);
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
				const view = currentViewRef.current;
				const scrollTop = element.scrollTop;
				scrollPositionsRef.current.set(view, scrollTop);
			});
		};
	}

	const attachScrollListener = useCallback((element: HTMLDivElement | null) => {
		const prev = attachedElementRef.current;
		const handler = scrollHandlerRef.current;

		// Remove listener from previous element
		if (prev && handler) {
			prev.removeEventListener("scroll", handler);
		}

		attachedElementRef.current = element;

		// Attach listener to new element
		if (element && handler) {
			element.addEventListener("scroll", handler, {
				passive: true,
			});

			// Also attach listener to scrollable children
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
			}
		}
	}, []);

	// Watch for scrollRef changes and find actual scrollable element
	const prevScrollElementRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const element = scrollElementRef.current;
		if (element === prevScrollElementRef.current) return;
		prevScrollElementRef.current = element;

		if (!element) return;

		// Wait a bit for DOM to settle
		const timeoutId = setTimeout(() => {
			const checkScrollable = (el: HTMLElement): HTMLElement | null => {
				const style = window.getComputedStyle(el);
				const isScrollable =
					(style.overflowY === "auto" || style.overflowY === "scroll") &&
					el.scrollHeight > el.clientHeight;

				if (isScrollable) {
					return el;
				}

				for (const child of Array.from(el.children)) {
					const result = checkScrollable(child as HTMLElement);
					if (result) return result;
				}

				return null;
			};

			const scrollable = checkScrollable(element);
			if (scrollable && scrollable !== element) {
				// Attach listener to the actual scrollable element
				const handler = scrollHandlerRef.current;
				if (handler) {
					scrollable.addEventListener("scroll", handler, {
						passive: true,
					});
				}
			}
		}, 200);

		return () => {
			clearTimeout(timeoutId);
		};
	});

	// Restore scroll position when view changes
	useLayoutEffect(() => {
		const element = scrollElementRef.current;
		if (!element) return;

		const savedPosition = scrollPositionsRef.current.get(state.value) ?? 0;

		// Use double RAF to ensure DOM is ready after view switch
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (scrollElementRef.current === element) {
					element.scrollTop = savedPosition;
				}
			});
		});
	}, [
		state.value,
	]);

	// Cleanup on unmount
	useLayoutEffect(() => {
		return () => {
			attachScrollListener(null);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [
		attachScrollListener,
	]);

	// Proxy RefObject for react-modal-sheet library
	const scrollRef = useMemo(() => {
		return {
			get current() {
				return scrollElementRef.current;
			},
			set current(node: HTMLDivElement | null) {
				scrollElementRef.current = node;
				attachScrollListener(node);

				// Restore scroll position when element is first attached
				if (node) {
					const savedPosition =
						scrollPositionsRef.current.get(currentViewRef.current) ?? 0;
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							if (scrollElementRef.current === node) {
								node.scrollTop = savedPosition;
							}
						});
					});
				}
			},
		} as React.RefObject<HTMLDivElement>;
	}, [
		attachScrollListener,
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
