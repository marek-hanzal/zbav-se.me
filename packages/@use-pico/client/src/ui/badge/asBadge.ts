import { tvc } from "@use-pico/cls";

export namespace asBadge {
	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl";
	export type Flow = "vertical" | "horizontal";
	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "top"
		| "bottom-left"
		| "bottom-right"
		| "bottom"
		| "left-center"
		| "right-center";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		round?: Round;
		flow?: Flow;
		snapTo?: SnapTo;
		zIndex?: boolean;
		disabled?: boolean;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asBadge = ({
	tone,
	theme,
	size = "md",
	flow = "horizontal",
	round = "default",
	snapTo,
	zIndex,
	disabled,
	className,
}: asBadge.Props) => {
	return {
		"data-ui": "Badge",
		//
		"data-tone": tone,
		"data-theme": theme,
		"data-size": size,
		"data-flow": flow,
		"data-round": round,
		"data-snap-to": snapTo,
		"data-z-index": zIndex,
		"data-disabled": disabled,
		//
		className: tvc("Badge", className),
	} as const;
};
