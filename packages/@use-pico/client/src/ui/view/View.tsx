import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import {
	Activity,
	type PropsWithChildren,
	type ReactNode,
	type RefObject,
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";

export namespace View {
	export type View<TProps> = PropsWithChildren<TProps>;

	export type Views<TView extends string, TProps> = Record<TView, View<TProps>>;

	export namespace Children {
		export interface Props {
			reset(): void;
			scrollRef: RefObject<HTMLDivElement>;
			content: ReactNode;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props<TView extends string, TProps> {
		state: StateType.State<TView>;
		views: Views<TView, TProps>;
		children: Children.RenderFn;
	}
}

export const View = <TView extends string, TProps>({
	state,
	views,
	children,
}: View.Props<TView, TProps>) => {
	const activityRootId = useId();
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

	return children({
		reset() {
			for (const view of Object.keys(views) as TView[]) {
				scrollPositionsRef.current.set(view, 0);
			}
		},
		scrollRef,
		content: entriesOf(views).map(([view, { children }]) => (
			<Activity
				key={`${activityRootId}-${view}`}
				mode={state.value === view ? "visible" : "hidden"}
			>
				{children}
			</Activity>
		)),
	});
};
