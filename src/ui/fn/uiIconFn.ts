import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiIconFn {
	export type Size = CoolUi.Size;

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		disabled?: CoolUi.Disabled;
		color?: CoolUi.Color;
		text?: CoolUi.Text;
		//
		opacity?: CoolUi.Opacity;
		//
		snapTo?: CoolUi.SnapTo;
		background?: CoolUi.Background;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiIconFn = ({ name = "Icon", className, ...ui }: uiIconFn.Props) => {
	return coolUiFn<uiIconFn.Ui>({
		name,
		ui,
		className,
	});
};
