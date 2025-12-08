import { tvc } from "@use-pico/cls";

export namespace asTypo {
	export type Tone = "primary" | "secondary" | "subtle" | "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	export type Display = "inline" | "block";
	export type Font = "light" | "normal" | "bold";
	export type Wrap = "wrap" | "nowrap";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		display?: Display;
		font?: Font;
		wrap?: Wrap;
		truncate?: boolean;
		italic?: boolean;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asTypo = ({
	tone,
	theme,
	size,
	display,
	font,
	wrap,
	truncate,
	italic,
	className,
}: asTypo.Props) => {
	return {
		"data-ui": "Typo",
		//
		"data-tone": tone,
		"data-theme": theme,
		"data-size": size,
		"data-display": display,
		"data-font": font,
		"data-wrap": wrap,
		"data-truncate": truncate,
		"data-italic": italic,
		//
		className: tvc("Typo", className),
	} as const;
};
