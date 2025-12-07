import type { ComponentProps, FC, ReactNode } from "react";
import type { UiProps } from "../../type";

export namespace Typo {
	export type Value = ReactNode;

	export type Preset = "none" | "header" | "subheader" | "label" | "paragraph" | "blockquote";

	export type Tone = "primary" | "secondary" | "subtle" | "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	export type Display = "inline" | "block";
	export type Font = "light" | "normal" | "bold";
	export type Wrap = "wrap" | "nowrap";

	export interface Props extends UiProps<ComponentProps<"div">> {
		label: Value;
		truncate?: boolean;
		preset?: Preset;
		display?: Display;
		wrap?: Wrap;
		size?: Size;
		font?: Font;
		tone?: Tone;
		theme?: Theme;
		italic?: boolean;
	}

	export type PropsEx = Omit<Props, "label">;
}

const presets: Record<Typo.Preset, Partial<Typo.Props>> = {
	none: {},
	label: {
		size: "lg",
		font: "bold",
	},
	header: {
		size: "3xl",
		font: "bold",
		display: "block",
	},
	subheader: {
		size: "xl",
		font: "bold",
		display: "block",
	},
	blockquote: {},
	paragraph: {},
};

export const Typo: FC<Typo.Props> = ({
	ui,
	label,
	preset = "none",
	truncate,
	display,
	wrap,
	size,
	font,
	tone,
	theme,
	italic = false,
	...props
}) => {
	return (
		<div
			data-root="Typo-root"
			data-ui={ui ?? "Typo-root"}
			//
			data-tone={tone}
			data-theme={theme}
			//
			data-size={size}
			data-display={display}
			data-font={font}
			data-wrap={wrap}
			data-truncate={truncate}
			data-italic={italic}
			{...presets[preset]}
			//;
			{...props}
		>
			{label}
		</div>
	);
};
