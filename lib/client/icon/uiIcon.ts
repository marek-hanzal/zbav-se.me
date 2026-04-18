import { ui as coolUi } from "@/lib/client/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiIcon {
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

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiIcon = ({ name = "Icon", className, ...ui }: uiIcon.Props) => {
	return coolUi<uiIcon.Ui>({
		name,
		ui,
		className,
	});
};
