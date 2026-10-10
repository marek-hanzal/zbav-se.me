import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiFormFieldFn {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		//
		size?: CoolUi.Size;
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
		disabled?: CoolUi.Disabled;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiFormFieldFn = ({ name = "FormField", className, ...ui }: uiFormFieldFn.Props) => {
	return coolUiFn<uiFormFieldFn.Ui>({
		name,
		ui,
		className,
	});
};
