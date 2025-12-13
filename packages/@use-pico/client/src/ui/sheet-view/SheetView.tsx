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

	const elRef = useRef<HTMLDivElement | null>(null);
	const scrollByViewRef = useRef(new Map<TView, number>());
	const viewRef = useRef(state.value);
	viewRef.current = state.value;

	const rafRef = useRef<number | null>(null);
	const attachedElRef = useRef<HTMLDivElement | null>(null);

	const onScrollRef = useRef<(e: Event) => void>();
	if (!onScrollRef.current) {
		onScrollRef.current = (e: Event) => {
			if (rafRef.current != null) return;

			const target = e.currentTarget as HTMLDivElement | null;
			if (!target) return;

			const top = target.scrollTop;
			const view = viewRef.current;

			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				scrollByViewRef.current.set(view, top);
			});
		};
	}

	const attachTo = (el: HTMLDivElement | null) => {
		const prev = attachedElRef.current;
		if (prev && onScrollRef.current) {
			prev.removeEventListener("scroll", onScrollRef.current);
		}

		attachedElRef.current = el;

		if (el && onScrollRef.current) {
			el.addEventListener("scroll", onScrollRef.current, {
				passive: true,
			});
		}
	};

	// Proxy RefObject: library wants RefObject, we want to run logic on set.
	const scrollRef = useMemo(() => {
		return {
			get current() {
				return elRef.current;
			},
			set current(node: HTMLDivElement | null) {
				elRef.current = node;
				attachTo(node);

				// Restore immediately when the scroller appears (sheet opens).
				if (!node) return;

				const top = scrollByViewRef.current.get(viewRef.current) ?? 0;
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (elRef.current !== node) return;
						node.scrollTop = top;
					});
				});
			},
		} as React.RefObject<HTMLDivElement>;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Restore on view change too (when element already exists).
	useLayoutEffect(() => {
		const el = elRef.current;
		if (!el) return;

		const top = scrollByViewRef.current.get(state.value) ?? 0;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (elRef.current !== el) return;
				el.scrollTop = top;
			});
		});
	}, [
		state.value,
	]);

	// Cleanup on unmount.
	useLayoutEffect(() => {
		return () => {
			attachTo(null);
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<BottomSheet
			{...props}
			{...current}
			contentProps={{
				...contentProps,
				scrollRef, // <-- proper RefObject for react-modal-sheet
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
