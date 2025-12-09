import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiBadge {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		round?: CoolUi.Round;
		size?: CoolUi.Size;
		//
		height?: CoolUi.Height;
		width?: CoolUi.Width;
		//
		position?: CoolUi.Position;
		//
		snapTo?: CoolUi.SnapTo;
		//
		opacity?: CoolUi.Opacity;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiBadge = ({ ui, className }: uiBadge.Props) => {
	return coolUi<uiBadge.Ui>({
		name: "Badge",
		ui: {
			theme: "light",
			tone: "primary",
			...ui,
		},
		className,
	});
};
