import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiFulltextFn {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		position?: CoolUi.Position;
		width?: CoolUi.Width;
		height?: CoolUi.Height;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiFulltextFn = ({ name = "Fulltext", className, ...ui }: uiFulltextFn.Props) => {
	return coolUiFn<uiFulltextFn.Ui>({
		name,
		ui: {
			"data-ui-tone": "primary",
			"data-ui-theme": "light",
			"data-ui-width": "full",
			"data-ui-position": "relative",
			...ui,
		},
		className,
	});
};
