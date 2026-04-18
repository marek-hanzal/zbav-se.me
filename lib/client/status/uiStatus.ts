import { ui as coolUi } from "../cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiStatus {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		flow?: CoolUi.Flow;
		width?: CoolUi.Width;
		height?: CoolUi.Height;
		gap?: CoolUi.Gap;
		//
		color?: CoolUi.Color;
		text?: CoolUi.Text;
		inner?: CoolUi.Inner;
		background?: CoolUi.Background;
		border?: CoolUi.Border;
		shadow?: CoolUi.Shadow;
		opacity?: CoolUi.Opacity;
		round?: CoolUi.Round;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiStatus = ({ className, ...ui }: uiStatus.Props) => {
	return coolUi<uiStatus.Ui>({
		name: "Status",
		ui: {
			"data-ui-flow": "vertical",
			"data-ui-color": "lead",
			"data-ui-gap": "default",
			"data-ui-text": "3xl",
			"data-ui-width": "full",
			...ui,
		},
		className,
	});
};
