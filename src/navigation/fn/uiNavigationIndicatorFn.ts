import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiNavigationIndicatorFn {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		visible?: boolean;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiNavigationIndicatorFn = ({
	name = "NavigationIndicator",
	className,
	...ui
}: uiNavigationIndicatorFn.Props) => {
	return coolUiFn<uiNavigationIndicatorFn.Ui>({
		name,
		ui,
		className,
	});
};
