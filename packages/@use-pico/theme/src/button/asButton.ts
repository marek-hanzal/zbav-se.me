import { attr } from "../attr/attr";

const attributes = [
	"theme",
	"tone",
	"size",
	"round",
	"snapTo",
	"items",
	"justify",
	"disabled",
	"background",
	"square",
	"border",
	"shadow",
	"opacity",
	"zIndex",
] as const satisfies (keyof attr.Attributes)[];
type Attributes = (typeof attributes)[number];

export namespace asButton {
	export type Size = attr.Size;

	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest>;
}

export const asButton = <const TRest extends attr.Rest>({
	tone = "primary",
	theme = "light",
	round = "default",
	items = "center",
	justify = "center",
	background = true,
	border = true,
	shadow = true,
	...props
}: asButton.Props<TRest>) => {
	return attr({
		ui: "Button",
		attrs: attributes,
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
