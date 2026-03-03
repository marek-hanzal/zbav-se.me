import type { StateType } from "@use-pico/common/type";
import { BottomSheet } from "../bottom-sheet";
import { View } from "../view";

export namespace SheetView {
	export type Views<TView extends string> = View.Views<TView, BottomSheet.PropsEx>;

	export interface Props<TView extends string> extends Omit<BottomSheet.Props, "children"> {
		state: StateType.State<TView>;
		views: Views<TView>;
	}

	export type PropsEx<TView extends string> = Omit<Props<TView>, "views" | "state">;
}

export const SheetView = <TView extends string>({
	state,
	views,
	contentProps,
	...props
}: SheetView.Props<TView>) => {
	const { children: _, ...current } = views[state.value];

	const rest = {
		...props,
		...current,
	};

	return (
		<View
			state={state}
			views={views}
		>
			{({ content }) => {
				return (
					<BottomSheet
						{...rest}
						contentProps={{
							disableScroll: true,
							...contentProps,
						}}
					>
						{content}
					</BottomSheet>
				);
			}}
		</View>
	);
};
