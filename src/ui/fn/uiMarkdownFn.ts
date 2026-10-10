import { uiFn as coolUiFn } from "~/ui/fn/uiFn";
import type { Ui as CoolUi } from "~/ui/type/Ui";

export namespace uiMarkdownFn {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		color?: CoolUi.Color;
		text?: CoolUi.Text;
		inner?: CoolUi.Inner;
		background?: CoolUi.Background;
		opacity?: CoolUi.Opacity;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiMarkdownFn = ({ name = "Markdown", className, ...ui }: uiMarkdownFn.Props) => {
	return coolUiFn<uiMarkdownFn.Ui>({
		name,
		ui: {
			"data-ui-text": "default",
			...ui,
		},
		className,
	});
};
