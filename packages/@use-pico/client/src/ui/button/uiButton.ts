import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiButton {
	export type Size = CoolUi.Size;

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		size?: Size;
		square?: CoolUi.Square;
		gap?: CoolUi.Gap;
		round?: CoolUi.Round;
		snapTo?: CoolUi.SnapTo;
		opacity?: CoolUi.Opacity;
		//
		width?: CoolUi.Width;
		height?: CoolUi.Height;
		//
		flow?: CoolUi.Flow;
		//
		justify?: CoolUi.Justify;
		items?: CoolUi.Items;
		//
		disabled?: boolean;
		background?: boolean;
		border?: boolean;
		shadow?: boolean;
		zIndex?: boolean;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		lead?: boolean;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiButton = ({ ui, className }: uiButton.Props) => {
	return coolUi<uiButton.Ui>({
		name: "Button",
		ui: {
			theme: "light",
			tone: "primary",
			justify: "center",
			items: "center",
			flow: "horizontal",
			round: "default",
			gap: "sm",
			background: true,
			border: true,
			shadow: true,
			...ui,
		},
		className,
	});
};
