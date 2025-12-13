import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import { Activity, type ReactNode, useCallback, useLayoutEffect, useMemo, useRef } from "react";
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
	const attachedListenersRef = useRef<Set<HTMLElement>>(new Set());
	const rafIdRef = useRef<number | null>(null);
	const currentViewRef = useRef(state.value);

	currentViewRef.current = state.value;

	// Find scrollable element (element itself or a scrollable child)
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

	// Attach scroll listeners to element and scrollable children
	const attachListeners = useCallback(
		(element: HTMLDivElement | null) => {
			// Scroll handler: save position for current view
			const handler = () => {
				const el = scrollElementRef.current;
				if (!el || rafIdRef.current !== null) return;

				rafIdRef.current = requestAnimationFrame(() => {
					rafIdRef.current = null;
					scrollPositionsRef.current.set(currentViewRef.current, el.scrollTop);
				});
			};

			// Remove all existing listeners
			for (const el of attachedListenersRef.current) {
				el.removeEventListener("scroll", handler);
			}
			attachedListenersRef.current.clear();

			if (!element) return;

			// Attach to element itself
			element.addEventListener("scroll", handler, {
				passive: true,
			});
			attachedListenersRef.current.add(element);

			// Find and attach to scrollable children
			const scrollableChildren = Array.from(element.querySelectorAll("*")).filter((el) => {
				const htmlEl = el as HTMLElement;
				const style = window.getComputedStyle(htmlEl);
				return (
					htmlEl.scrollHeight > htmlEl.clientHeight &&
					(style.overflowY === "auto" || style.overflowY === "scroll")
				);
			});
			for (const child of scrollableChildren) {
				(child as HTMLElement).addEventListener("scroll", handler, {
					passive: true,
				});
				attachedListenersRef.current.add(child as HTMLElement);
			}

			// Wait for DOM to settle, then find actual scrollable element
			setTimeout(() => {
				const scrollable = findScrollableElement(element);
				if (
					scrollable &&
					scrollable !== element &&
					!attachedListenersRef.current.has(scrollable)
				) {
					scrollable.addEventListener("scroll", handler, {
						passive: true,
					});
					attachedListenersRef.current.add(scrollable);
				}
			}, 200);
		},
		[
			findScrollableElement,
		],
	);

	// Restore scroll when view changes
	useLayoutEffect(() => {
		const element = scrollElementRef.current;
		if (!element) return;

		const savedPosition = scrollPositionsRef.current.get(state.value) ?? 0;
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
			attachListeners(null);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [
		attachListeners,
	]);

	// Proxy RefObject for react-modal-sheet library
	const scrollRef = useMemo(() => {
		return {
			get current() {
				return scrollElementRef.current;
			},
			set current(node: HTMLDivElement | null) {
				scrollElementRef.current = node;
				attachListeners(node);
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
		attachListeners,
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
