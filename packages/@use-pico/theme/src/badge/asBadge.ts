import { tvc } from "@use-pico/cls";
import type { Type } from "../type/Type";

export namespace asBadge {
	export type Tone = Type.Tone;
	export type Theme = Type.Theme;
	export type Size = Type.Size;

	export type Flow = Type.Flow;
	export type Round = Type.Round;
	export type SnapTo = Type.SnapTo;

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
