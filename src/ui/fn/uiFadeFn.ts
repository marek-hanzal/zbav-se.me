import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiFadeFn {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
	}

	export type Component<TRest extends object = object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiFadeFn = ({ name = "Fade", className, ...ui }: uiFadeFn.Props) => {
	return coolUiFn<uiFadeFn.Ui>({
		name,
		ui: {
			"data-ui-theme": "light",
			"data-ui-tone": "primary",
			...ui,
		},
		className,
	});
};
