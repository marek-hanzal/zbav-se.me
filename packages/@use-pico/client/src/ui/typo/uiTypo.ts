import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiTypo {
	export type Wrap = "wrap" | "nowrap";

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		italic?: boolean;
		//
		display?: CoolUi.Display;
		truncate?: boolean;
		wrap?: Wrap;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiTypo = ({ ui, className }: uiTypo.Props) => {
	return coolUi({
		name: "Typo",
		ui: {
			text: "default",
			display: "inline",
			...ui,
		},
		className,
	});
};
