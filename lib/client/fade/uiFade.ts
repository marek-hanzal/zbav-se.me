import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiFade {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
	}

	export type Component<TRest extends object = object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiFade = ({ ui, className }: uiFade.Props) => {
	return coolUi<uiFade.Ui>({
		name: "Fade",
		ui: {
			"data-ui-theme": "light",
			"data-ui-tone": "primary",
			...ui,
		},
		className,
	});
};
