import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiInputFn {
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

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiInputFn = ({ name = "Input", className, ...ui }: uiInputFn.Props) => {
	return coolUiFn<uiInputFn.Ui>({
		name,
		ui: {
			"data-ui-tone": "neutral",
			"data-ui-theme": "light",
			"data-ui-text": "default",
			"data-ui-color": "text",
			"data-ui-border": true,
			"data-ui-shadow": false,
			"data-ui-round": "default",
			"data-ui-width": "full",
			"data-ui-inner": "default",
			...ui,
		},
		className,
	});
};
