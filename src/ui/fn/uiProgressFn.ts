import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiProgressFn {
	export interface Ui {
		tone?: CoolUi.Tone;
		theme?: CoolUi.Theme;
		size?: CoolUi.Size;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiProgressFn = ({ name = "Progress", className, ...ui }: uiProgressFn.Props) => {
	return coolUiFn<uiProgressFn.Ui>({
		name,
		ui,
		className,
	});
};
