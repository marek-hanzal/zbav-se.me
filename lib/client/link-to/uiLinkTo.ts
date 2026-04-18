import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiLinkTo {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		size?: CoolUi.Size;
		text?: CoolUi.Text;
		justify?: CoolUi.Justify;
		items?: CoolUi.Items;
		gap?: CoolUi.Gap;
		round?: CoolUi.Round;
		inner?: CoolUi.Inner;
		snapTo?: CoolUi.SnapTo;
		color?: CoolUi.Color;
		flow?: CoolUi.Flow;
		display?: CoolUi.Display;
		width?: CoolUi.Width;
		height?: CoolUi.Height;
		opacity?: CoolUi.Opacity;
		background?: CoolUi.Background;
		border?: CoolUi.Border;
		shadow?: CoolUi.Shadow;
		position?: CoolUi.Position;
		disabled?: CoolUi.Disabled;
		zIndex?: CoolUi.zIndex;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiLinkTo = ({ ui, className }: uiLinkTo.Props) => {
	return coolUi<uiLinkTo.Ui>({
		name: "LinkTo",
		ui: {
			"data-ui-tone": "link",
			"data-ui-theme": "light",
			"data-ui-text": "default",
			"data-ui-color": "lead",
			"data-ui-flow": "horizontal",
			"data-ui-gap": "default",
			"data-ui-items": "center",
			"data-ui-justify": "start",
			...ui,
		},
		className,
	});
};
