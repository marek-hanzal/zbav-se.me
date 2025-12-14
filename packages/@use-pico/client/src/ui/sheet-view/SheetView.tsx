import type { StateType } from "@use-pico/common/type";
import { BottomSheet } from "../bottom-sheet";
import { View } from "../view";

export namespace SheetView {
	export interface Props<TView extends string> extends Omit<BottomSheet.Props, "children"> {
		state: StateType.State<TView>;
		views: View.Views<TView, View.View<Partial<BottomSheet.Props>>>;
	}
}

export const SheetView = <TView extends string>({
	state,
	views,
	contentProps,
	...props
}: SheetView.Props<TView>) => {
	const { children: _, ...current } = views[state.value];

	const { onClose, ...rest } = {
		...props,
		...current,
	};

	return (
		<View
			state={state}
			views={views}
		>
			{({ reset, scrollRef, content }) => (
				<BottomSheet
					{...rest}
					onClose={() => {
						onClose?.();
						reset();
					}}
					contentProps={{
						...contentProps,
						scrollRef,
					}}
				>
					{content}
				</BottomSheet>
			)}
		</View>
	);
};
