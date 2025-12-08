import { attr } from "../attr/attr";

const attributes = [
	"theme",
	"tone",
	"size",
	"round",
	"snapTo",
	"disabled",
	"flow",
	"items",
	"justify",
	"background",
	"border",
	"opacity",
	"shadow",
] as const satisfies (keyof attr.Attributes)[];

type Attributes = (typeof attributes)[number];

export namespace asBadge {
	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest>;
}

export const asBadge = <const TRest extends attr.Rest>({
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
}: asBadge.Props<TRest>) => {
	return attr({
		ui: "Badge",
		attrs: attributes,
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
