import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import { Activity, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { BottomSheet } from "../bottom-sheet";

export namespace SheetView {
	export interface View extends Partial<BottomSheet.Props> {
		children: ReactNode;
	}

	export interface Props<TView extends string> extends Omit<BottomSheet.Props, "children"> {
		state: StateType.State<TView>;
		//
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
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollByViewRef = useRef(new Map<TView, number>());
	const rafRef = useRef<number>(undefined);

	const event: EventListener = useCallback(
		(e) => {
			if (rafRef.current || e.currentTarget === null) {
				return;
			}
			const target = e.currentTarget as HTMLElement;

			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = undefined;
				scrollByViewRef.current.set(state.value, target.scrollTop);
			});
		},
		[
			state.value,
		],
	);

	useEffect(() => {
		return () => {
			scrollRef.current?.removeEventListener("scroll", event);
		};
	}, [
		event,
	]);

	useLayoutEffect(() => {
		const element = scrollRef.current;
		if (!element) {
			return;
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				element.scrollTop = scrollByViewRef.current.get(state.value) ?? 0;
			});
		});
	}, [
		state.value,
	]);

	return (
		<BottomSheet
			{...props}
			{...current}
			contentProps={{
				scrollRef(element) {
					scrollRef.current = element;
					element?.addEventListener("scroll", event, {
						passive: true,
					});
				},
				...contentProps,
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
