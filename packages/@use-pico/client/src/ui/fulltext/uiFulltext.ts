import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiFulltext {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		position?: CoolUi.Position;
		width?: CoolUi.Width;
		height?: CoolUi.Height;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiFulltext = ({ ui, className }: uiFulltext.Props) => {
	return coolUi<uiFulltext.Ui>({
		name: "Fulltext",
		ui: {
			tone: "primary",
			theme: "light",
			width: "full",
			position: "relative",
			...ui,
		},
		className,
	});
};
