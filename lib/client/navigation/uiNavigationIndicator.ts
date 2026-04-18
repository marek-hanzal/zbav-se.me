import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiNavigationIndicator {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		visible?: boolean;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiNavigationIndicator = ({
	name = "NavigationIndicator",
	className,
	...ui
}: uiNavigationIndicator.Props) => {
	return coolUi<uiNavigationIndicator.Ui>({
		name,
		ui,
		className,
	});
};
