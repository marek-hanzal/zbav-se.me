import { attr } from "../attr/attr";

export namespace asButton {
	export type Size = attr.Size;

	export type Props<TProps = unknown> = attr.PropsEx<
		| "theme"
		| "tone"
		| "size"
		| "round"
		| "snapTo"
		| "justify"
		| "disabled"
		| "background"
		| "square"
		| "border"
		| "shadow"
		| "zIndex",
		TProps
	>;
}

export const asButton = ({
	tone = "primary",
	theme = "light",
	size = "md",
	round = "default",
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
		size,
		round,
		justify,
		background,
		border,
		shadow,
		//
		...props,
	});
};
