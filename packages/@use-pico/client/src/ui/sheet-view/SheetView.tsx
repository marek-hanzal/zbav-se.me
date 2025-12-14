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
	currentViewRef.current = state.value;
	const rafIdRef = useRef<number | undefined>(undefined);
	const scrollHandlerRef = useRef((e: Event) => {
		const element = e.currentTarget as HTMLDivElement | null;
		if (!element || rafIdRef.current !== undefined) {
			return;
		}

		const top = element.scrollTop;
		const view = currentViewRef.current;

		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = undefined;
			scrollPositionsRef.current.set(view, top);
		});
	});

	// Restore scroll position helper
	const restoreScroll = useCallback((element: HTMLDivElement, view: TView) => {
		const position = scrollPositionsRef.current.get(view) ?? 0;
		requestAnimationFrame(() => {
			if (scrollElementRef.current === element) {
				element.scrollTop = position;
			}
		});
	}, []);

	// Restore scroll position when view changes
	useLayoutEffect(() => {
		const element = scrollElementRef.current;
		if (element) {
			restoreScroll(element, state.value);
		}
	}, [
		state.value,
		restoreScroll,
	]);

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

				// Attach listener and restore scroll for new element
				if (node) {
					node.addEventListener("scroll", scrollHandlerRef.current, {
						passive: true,
					});
					restoreScroll(node, currentViewRef.current);
				}
			},
		} as React.RefObject<HTMLDivElement>;
	}, [
		restoreScroll,
	]);

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

	useEffect(() => {
		if (props.isOpen) {
			return;
		}

		for (const view of Object.keys(views) as TView[]) {
			scrollPositionsRef.current.set(view, 0);
		}
	}, [
		props.isOpen,
		views,
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
