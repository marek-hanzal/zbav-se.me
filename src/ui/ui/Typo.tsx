import type { ComponentProps, FC, ReactNode } from "react";
import type { uiFn } from "~/ui/fn/uiFn";
import { uiTypoFn } from "~/ui/fn/uiTypoFn";

const presets = {
	none: {},
	label: {
		"data-ui-text": "lg",
		"data-ui-font": "bold",
	},
	header: {
		"data-ui-tone": "brand",
		"data-ui-theme": "light",
		"data-ui-text": "lg",
		"data-ui-color": "lead",
		"data-ui-font": "bold",
		"data-ui-display": "block",
		"data-ui-opacity": "8",
	},
	subheader: {
		"data-ui-text": "lg",
		"data-ui-font": "semibold",
		"data-ui-display": "block",
	},
	blockquote: {},
	paragraph: {},
} satisfies Record<Typo.Preset, uiFn.Data<uiTypoFn.Ui, keyof uiTypoFn.Ui>>;

export namespace Typo {
	export type Value = ReactNode;

	export type Preset = "none" | "header" | "subheader" | "label" | "paragraph" | "blockquote";

	export interface Props extends uiTypoFn.Component<ComponentProps<"span">> {
		label: Value;
		preset?: Preset;
	}

	export type PropsEx = Omit<Props, "label">;
}

export const Typo: FC<Typo.Props> = ({
	label,
	preset = "none",
	//
	className,
	...props
}) => {
	return (
		<span
			{...uiTypoFn({
				...presets[preset],
				className,
			})}
			//
			{...props}
		>
			{label}
		</span>
	);
};
