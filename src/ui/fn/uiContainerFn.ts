import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiContainerFn {
	export type Layout =
		| "vertical"
		| "vertical-full"
		| "vertical-header-content-footer"
		| "vertical-header-content"
		| "vertical-content-footer"
		| "vertical-centered"
		| "vertical-flex"
		//
		| "horizontal"
		| "horizontal-full"
		| "horizontal-flex";
	export type Scroll = "vertical" | "horizontal";
	export type Snap = "vertical" | "horizontal";
	export type SnapAlign = "start" | "center" | "end";

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		layout?: Layout;
		height?: CoolUi.Height;
		width?: CoolUi.Width;
		badge?: CoolUi.Badge;
		gap?: CoolUi.Gap;
		inner?: CoolUi.Inner;
		snapTo?: CoolUi.SnapTo;
		snap?: Snap;
		snapAlign?: SnapAlign;
		//
		items?: CoolUi.Items;
		justify?: CoolUi.Justify;
		//
		opacity?: CoolUi.Opacity;
		//
		position?: CoolUi.Position;
		//
		scroll?: Scroll;
		//
		round?: CoolUi.Round;
		//
		disabled?: CoolUi.Disabled;
		background?: CoolUi.Background;
		text?: CoolUi.Text;
		border?: CoolUi.Border;
		shadow?: CoolUi.Shadow;
		zIndex?: CoolUi.zIndex;
		color?: CoolUi.Color;
		square?: CoolUi.Square;
		flow?: CoolUi.Flow;
		font?: CoolUi.Font;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiContainerFn = ({ name = "Container", className, ...ui }: uiContainerFn.Props) => {
	return coolUiFn<uiContainerFn.Ui>({
		name,
		ui,
		className,
	});
};
