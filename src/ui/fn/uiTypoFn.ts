import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiTypoFn {
	export type Wrap = "wrap" | "nowrap";

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		italic?: CoolUi.Italic;
		//
		display?: CoolUi.Display;
		truncate?: boolean;
		wrap?: Wrap;
		color?: CoolUi.Color;
		snapTo?: CoolUi.SnapTo;
		position?: CoolUi.Position;
		opacity?: CoolUi.Opacity;
		inner?: CoolUi.Inner;
		background?: CoolUi.Background;
		border?: CoolUi.Border;
		shadow?: CoolUi.Shadow;
		round?: CoolUi.Round;
		width?: CoolUi.Width;
		//
		size?: CoolUi.Size;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiTypoFn = ({ name = "Typo", className, ...ui }: uiTypoFn.Props) => {
	return coolUiFn({
		name,
		ui: {
			"data-ui-display": "inline",
			...ui,
		},
		className,
	});
};
