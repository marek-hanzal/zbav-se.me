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

export const uiFade = ({ name = "Fade", className, ...ui }: uiFade.Props) => {
	return coolUi<uiFade.Ui>({
		name,
		ui: {
			"data-ui-theme": "light",
			"data-ui-tone": "primary",
			...ui,
		},
		className,
	});
};
