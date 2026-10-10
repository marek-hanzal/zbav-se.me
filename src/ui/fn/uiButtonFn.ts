import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiButtonFn {
	export type Size = CoolUi.Size;

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		size?: Size;
		inner?: CoolUi.Inner;
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
		disabled?: CoolUi.Disabled;
		background?: CoolUi.Background;
		backgroundActive?: CoolUi.BackgroundActive;
		border?: CoolUi.Border;
		borderActive?: CoolUi.BorderActive;
		shadow?: CoolUi.Shadow;
		shadowActive?: CoolUi.ShadowActive;
		zIndex?: CoolUi.zIndex;
		badge?: CoolUi.Badge;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		color?: CoolUi.Color;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiButtonFn = ({ name = "Button", className, ...ui }: uiButtonFn.Props) => {
	return coolUiFn<uiButtonFn.Ui>({
		name,
		ui: {
			"data-ui-justify": "start",
			"data-ui-items": "center",
			"data-ui-flow": "horizontal",
			"data-ui-round": "default",
			"data-ui-gap": "sm",
			"data-ui-color": "text",
			"data-ui-background": "default",
			"data-ui-border": true,
			"data-ui-shadow": true,
			...ui,
		},
		className: [
			"border-t-transparent",
			"border-x-transparent",
			className,
		],
	});
};
