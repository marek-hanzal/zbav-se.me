import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiInput {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		color?: CoolUi.Color;
		size?: CoolUi.Size;
		inner?: CoolUi.Inner;
		square?: CoolUi.Square;
		gap?: CoolUi.Gap;
		round?: CoolUi.Round;
		background?: CoolUi.Background;
		backgroundActive?: CoolUi.BackgroundActive;
		border?: CoolUi.Border;
		borderActive?: CoolUi.BorderActive;
		shadow?: CoolUi.Shadow;
		shadowActive?: CoolUi.ShadowActive;
		opacity?: CoolUi.Opacity;
		zIndex?: CoolUi.zIndex;
		disabled?: CoolUi.Disabled;
		width?: CoolUi.Width;
		height?: CoolUi.Height;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiInput = ({ name = "Input", className, ...ui }: uiInput.Props) => {
	return coolUi<uiInput.Ui>({
		name,
		ui: {
			"data-ui-tone": "neutral",
			"data-ui-theme": "light",
			"data-ui-text": "default",
			"data-ui-color": "text",
			"data-ui-background": "default",
			"data-ui-border": true,
			"data-ui-shadow": true,
			"data-ui-round": "default",
			"data-ui-width": "full",
			"data-ui-inner": "default",
			...ui,
		},
		className,
	});
};
