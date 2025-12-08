import { attr } from "../attr/attr";

export namespace asBadge {
	export type Props<TProps = unknown> = attr.Component<
		| "theme"
		| "tone"
		| "size"
		| "round"
		| "snapTo"
		| "disabled"
		| "flow"
		| "items"
		| "justify"
		| "background"
		| "border"
		| "shadow",
		TProps
	>;
}

export const asBadge = ({
	theme = "light",
	tone = "primary",
	size = "md",
	round = "default",
	flow = "horizontal",
	items = "center",
	justify = "center",
	background = true,
	border = true,
	shadow = true,
	...props
}: asBadge.Props) => {
	return attr({
		ui: "Badge",
		//
		theme,
		tone,
		size,
		round,
		flow,
		items,
		justify,
		background,
		border,
		shadow,
		//
		...props,
	});
};
