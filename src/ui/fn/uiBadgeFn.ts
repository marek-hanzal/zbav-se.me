import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiBadgeFn {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		badge?: CoolUi.Badge;
		round?: CoolUi.Round;
		size?: CoolUi.Size;
		//
		height?: CoolUi.Height;
		width?: CoolUi.Width;
		inner?: CoolUi.Inner;
		//
		flow?: CoolUi.Flow;
		items?: CoolUi.Items;
		justify?: CoolUi.Justify;
		gap?: CoolUi.Gap;
		//
		position?: CoolUi.Position;
		//
		snapTo?: CoolUi.SnapTo;
		//
		opacity?: CoolUi.Opacity;
		//
		text?: CoolUi.Text;
		font?: CoolUi.Font;
		italic?: CoolUi.Italic;
		//
		border?: CoolUi.Border;
		shadow?: CoolUi.Shadow;
		zIndex?: CoolUi.zIndex;
		//
		color?: CoolUi.Color;
		background?: CoolUi.Background;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiBadgeFn = ({ name = "Badge", className, ...ui }: uiBadgeFn.Props) => {
	return coolUiFn<uiBadgeFn.Ui>({
		name,
		ui: {
			"data-ui-theme": "light",
			"data-ui-tone": "primary",
			"data-ui-badge": "default",
			"data-ui-color": "lead",
			"data-ui-background": "alt",
			"data-ui-round": "default",
			"data-ui-shadow": true,
			...ui,
		},
		className,
	});
};
