import { tvc } from "@use-pico/cls";

export namespace asStatus {
	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asStatus = ({ tone, theme, className }: asStatus.Props) => {
	return {
		"data-ui": "Status",
		//
		"data-tone": tone,
		"data-theme": theme,
		//
		className: tvc("Status", className),
	} as const;
};
