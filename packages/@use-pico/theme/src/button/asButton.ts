import { attr } from "../attr/attr";

export namespace asButton {
	export type Size = attr.Size;

	export type Props<TProps = unknown> = attr.Component<
		| "theme"
		| "tone"
		| "size"
		| "round"
		| "snapTo"
		| "items"
		| "justify"
		| "disabled"
		| "background"
		| "square"
		| "border"
		| "shadow"
		| "opacity"
		| "zIndex",
		TProps
	>;
}

export const asButton = ({
	tone = "primary",
	theme = "light",
	round = "default",
	items = "center",
	justify = "center",
	background = true,
	border = true,
	shadow = true,
	...props
}: asButton.Props) => {
	return attr({
		ui: "Button",
		//
		tone,
		theme,
		//
		round,
		items,
		justify,
		background,
		border,
		shadow,
		//
		...props,
	});
};
