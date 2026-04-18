import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiProgress {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		size?: CoolUi.Size;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiProgress = ({ className, ...ui }: uiProgress.Props) => {
	return coolUi<uiProgress.Ui>({
		name: "Progress",
		ui,
		className,
	});
};
