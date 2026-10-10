import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiStatusFn {
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

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiStatusFn = ({ name = "Status", className, ...ui }: uiStatusFn.Props) => {
	return coolUiFn<uiStatusFn.Ui>({
		name,
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
