import { entriesOf } from "@use-pico/common/entries-of";
import type { StateType } from "@use-pico/common/type";
import { Activity, type ReactNode } from "react";
import { BottomSheet } from "../bottom-sheet";

export namespace SheetView {
	export interface Props<TView extends string> extends BottomSheet.Props {
		state: StateType.State<TView>;
		//
		views: Record<TView, ReactNode>;
	}
}

export const SheetView = <TView extends string>({
	state,
	views,
	...props
}: SheetView.Props<TView>) => {
	return (
		<BottomSheet {...props}>
			{entriesOf(views).map(([view, component]) => (
				<Activity
					key={view}
					mode={state.value === view ? "visible" : "hidden"}
				>
					{component}
				</Activity>
			))}
		</BottomSheet>
	);
};
