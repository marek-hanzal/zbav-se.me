import { tvc } from "@use-pico/cls";

export namespace asIcon {
	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		disabled?: boolean;
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asIcon = ({ tone, theme, size, disabled, className }: asIcon.Props) => {
	return {
		"data-root": "Icon",
		"data-tone": tone,
		"data-theme": theme,
		"data-size": size,
		"data-disabled": disabled,
		className: tvc("Icon", className),
	} as const;
};
