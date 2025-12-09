import type { Theme } from "../../../client/src/ui/Ui";
import { attr } from "../ui/attr";

export namespace asButton {
	export type Size = Theme.Size;

	export interface Attributes extends Theme.Attrs {
		//
	}

	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest>;
}

export const asButton = <TRest extends attr.Rest>({
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
	return attr<asButton.Attributes>({
		ui: "Button",
		attrs: [
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
			"width",
			"height",
			"shadow",
			"opacity",
			"zIndex",
		] as const,
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
