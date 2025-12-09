import type { Theme } from "../../../client/src/ui/Ui";
import { attr } from "../ui/attr";

export namespace asBadge {
	export interface Attributes extends Theme.Attrs {
		//
	}

	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest>;
}

export const asBadge = <TRest extends attr.Rest>({
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
	return attr<asBadge.Attributes>({
		ui: "Badge",
		attrs: [
			"theme",
			"tone",
			"size",
			"round",
			"snapTo",
			"disabled",
			"flow",
			"items",
			"justify",
			"height",
			"width",
			"square",
			"background",
			"border",
			"opacity",
			"shadow",
		] as const,
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
