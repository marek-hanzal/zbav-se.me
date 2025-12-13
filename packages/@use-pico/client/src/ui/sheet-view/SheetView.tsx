import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import { Activity, type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
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
	const rafIdRef = useRef<number | undefined>(undefined);
	const scrollHandlerRef = useRef(() => {
		const element = scrollElementRef.current;
		if (!element || rafIdRef.current !== undefined) {
			return;
		}

		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = undefined;
			scrollPositionsRef.current.set(currentViewRef.current, element.scrollTop);
		});
	});

	currentViewRef.current = state.value;

	// Proxy RefObject for react-modal-sheet library
	const scrollRef = useMemo(() => {
		let attachedElement: HTMLDivElement | null = null;

		return {
			get current() {
				return scrollElementRef.current;
			},
			set current(node: HTMLDivElement | null) {
				// Remove listener from previous element
				if (attachedElement) {
					attachedElement.removeEventListener("scroll", scrollHandlerRef.current);
				}

				scrollElementRef.current = node;
				attachedElement = node;

				// Attach listener to new element
				if (node) {
					node.addEventListener("scroll", scrollHandlerRef.current, {
						passive: true,
					});
				}
			},
		} as React.RefObject<HTMLDivElement>;
	}, []);

	// Cleanup on unmount
	useLayoutEffect(() => {
		return () => {
			const element = scrollElementRef.current;
			if (element) {
				element.removeEventListener("scroll", scrollHandlerRef.current);
			}
			if (rafIdRef.current !== undefined) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = undefined;
			}
		};
	}, []);

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
